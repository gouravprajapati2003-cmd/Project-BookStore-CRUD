import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cropper from 'react-easy-crop'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'

const apiUrl = import.meta.env.VITE_API_URL

// Crop image and convert it into File
const getCroppedImage = async (imageSrc, pixelCrop) => {
  const image = new Image()
  image.src = imageSrc

  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  const blob = await new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92)
  })

  if (!blob) {
    throw new Error('Image cropping failed.')
  }

  return new File([blob], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' })
}

function Profile () {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    profilePhoto: ''
  })

  const [preview, setPreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Cropper states
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropImage, setCropImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropping, setCropping] = useState(false)

  const token = localStorage.getItem('userToken')

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axios.get(`${apiUrl}/user/profile`, authConfig)

      const userData = res.data.data

      const photoUrl = userData.profilePhoto || ''

      setProfile({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        mobileNo: userData.mobileNo || '',
        email: userData.email || '',
        profilePhoto: photoUrl
      })

      setPreview(photoUrl)

      // Update Navbar Profile Photo
      window.dispatchEvent(
        new CustomEvent('profilePhotoUpdated', {
          detail: photoUrl
        })
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Handle Input Changes
  const handleChange = e => {
    const { name, value } = e.target

    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Select Image
  const handlePhotoChange = e => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG and WEBP images are allowed.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.')
      e.target.value = ''
      return
    }

    const imageUrl = URL.createObjectURL(file)

    setError('')
    setMessage('')
    setCropImage(imageUrl)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setShowCropModal(true)
  }

  // Crop area complete
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  // Close Crop Modal
  const closeCropModal = () => {
    if (cropImage) {
      URL.revokeObjectURL(cropImage)
    }

    setCropImage('')
    setShowCropModal(false)
    setCroppedAreaPixels(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Apply Crop
  const handleCropConfirm = async () => {
    try {
      if (!croppedAreaPixels || !cropImage) {
        setError('Please adjust your photo before cropping.')
        return
      }

      setCropping(true)
      setError('')

      const croppedFile = await getCroppedImage(cropImage, croppedAreaPixels)

      const croppedUrl = URL.createObjectURL(croppedFile)

      setSelectedFile(croppedFile)
      setPreview(croppedUrl)

      closeCropModal()
    } catch (err) {
      setError(err.message || 'Unable to crop image.')
    } finally {
      setCropping(false)
    }
  }

  // Upload Profile Photo
  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      setError('Please select a profile photo first.')
      return
    }

    try {
      setUploading(true)
      setError('')
      setMessage('')

      const formData = new FormData()
      formData.append('profilePhoto', selectedFile)

      const res = await axios.post(`${apiUrl}/user/profile/photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const photoUrl =
        res.data.data?.profilePhoto || res.data.profilePhoto || ''

      setProfile(prev => ({
        ...prev,
        profilePhoto: photoUrl
      }))

      if (photoUrl) {
        setPreview(photoUrl)

        // Update Navbar Profile Photo
        window.dispatchEvent(
          new CustomEvent('profilePhotoUpdated', {
            detail: photoUrl
          })
        )
      } else {
        await fetchProfile()
      }

      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setMessage(res.data.message || 'Profile photo updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile photo.')
    } finally {
      setUploading(false)
    }
  }

  // Remove Profile Photo
  const handleRemovePhoto = async () => {
    if (!profile.profilePhoto && !selectedFile) return

    // Remove only newly selected cropped image
    if (selectedFile) {
      setSelectedFile(null)
      setPreview(profile.profilePhoto || '')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      return
    }

    try {
      setRemoving(true)
      setError('')
      setMessage('')

      const res = await axios.delete(`${apiUrl}/user/profile/photo`, authConfig)

      setProfile(prev => ({
        ...prev,
        profilePhoto: ''
      }))

      setPreview('')

      // Remove Navbar Profile Photo
      window.dispatchEvent(
        new CustomEvent('profilePhotoUpdated', {
          detail: ''
        })
      )

      setMessage(res.data.message || 'Profile photo removed successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile photo.')
    } finally {
      setRemoving(false)
    }
  }

  // Update Profile
  const handleSubmit = async e => {
    e.preventDefault()

    if (!profile.firstName.trim()) {
      setError('First name is required.')
      return
    }

    if (profile.mobileNo && !/^[0-9]{10}$/.test(profile.mobileNo)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const res = await axios.put(
        `${apiUrl}/user/profile`,
        {
          firstName: profile.firstName.trim(),
          lastName: profile.lastName.trim(),
          mobileNo: profile.mobileNo.trim()
        },
        authConfig
      )

      setMessage(res.data.message || 'Profile updated successfully.')

      await fetchProfile()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  // Loading Screen
  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{
          minHeight: '65vh',
          backgroundColor: '#F5F7FA'
        }}
      >
        <div className='text-center'>
          <Spinner animation='border' style={{ color: '#142D4E' }} />
          <p className='mt-3 text-muted'>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profile.email) {
    return (
      <Container className='py-5'>
        <Button
          variant='outline-secondary'
          className='mb-4'
          onClick={() => navigate(-1)}
        >
          <i className='bi bi-arrow-left me-2' />
          Back
        </Button>

        <Alert variant='danger'>{error}</Alert>

        <Button
          onClick={fetchProfile}
          style={{
            backgroundColor: '#142D4E',
            borderColor: '#142D4E'
          }}
        >
          Try Again
        </Button>
      </Container>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#F5F7FA',
        minHeight: '75vh',
        padding: '30px 0 55px'
      }}
    >
      <Container>
        {/* Header */}
        <div className='d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3'>
          <div>
            <Button
              variant='outline-secondary'
              size='sm'
              className='mb-3'
              onClick={() => navigate(-1)}
              style={{ borderRadius: '7px' }}
            >
              <i className='bi bi-arrow-left me-2' />
              Back
            </Button>

            <h3 className='fw-bold mb-1' style={{ color: '#142D4E' }}>
              My Profile
            </h3>

            <p className='text-muted mb-0'>
              Manage your account information and profile photo.
            </p>
          </div>

          <div
            className='d-flex align-items-center gap-2 px-3 py-2 rounded-3'
            style={{
              backgroundColor: '#E8F5EE',
              color: '#198754'
            }}
          >
            <i className='bi bi-shield-check fs-5' />
            <span className='small fw-semibold'>Account Profile</span>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert variant='success' dismissible onClose={() => setMessage('')}>
            <i className='bi bi-check-circle me-2' />
            {message}
          </Alert>
        )}

        {error && (
          <Alert variant='danger' dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className='justify-content-center'>
          {/* Profile Photo Card */}
          <Col lg={4} className='mb-4'>
            <Card
              className='border-0 shadow-sm h-100'
              style={{ borderRadius: '15px' }}
            >
              <Card.Body className='p-4 text-center'>
                <div
                  className='rounded-top mb-4'
                  style={{
                    height: '85px',
                    margin: '-24px -24px 0',
                    background: 'linear-gradient(135deg, #142D4E, #24577B)'
                  }}
                />

                <div
                  className='mx-auto rounded-circle overflow-hidden d-flex align-items-center justify-content-center'
                  style={{
                    width: '135px',
                    height: '135px',
                    marginTop: '-90px',
                    position: 'relative',
                    backgroundColor: '#E8EEF5',
                    border: '5px solid white',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.12)'
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt='Profile'
                      className='w-100 h-100'
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <i
                      className='bi bi-person-fill'
                      style={{
                        fontSize: '70px',
                        color: '#142D4E'
                      }}
                    />
                  )}
                </div>

                <h5 className='fw-bold mt-3 mb-1' style={{ color: '#142D4E' }}>
                  {profile.firstName} {profile.lastName}
                </h5>

                <p className='text-muted small mb-4'>{profile.email}</p>

                <div className='d-grid gap-2'>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || removing}
                    style={{
                      backgroundColor: '#142D4E',
                      borderColor: '#142D4E',
                      borderRadius: '8px'
                    }}
                  >
                    <i className='bi bi-camera me-2' />
                    Change Profile Photo
                  </Button>

                  {(profile.profilePhoto || selectedFile) && (
                    <Button
                      variant='outline-danger'
                      onClick={handleRemovePhoto}
                      disabled={uploading || removing}
                      style={{ borderRadius: '8px' }}
                    >
                      {removing ? (
                        <Spinner size='sm' className='me-2' />
                      ) : (
                        <i className='bi bi-trash me-2' />
                      )}
                      Remove Photo
                    </Button>
                  )}
                </div>

                <Form.Control
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/png,image/webp'
                  className='d-none'
                  onChange={handlePhotoChange}
                />

                <div
                  className='mt-4 p-3 rounded-3 text-start'
                  style={{ backgroundColor: '#F5F7FA' }}
                >
                  <p className='small fw-semibold mb-2'>
                    <i className='bi bi-info-circle me-2' />
                    Photo Guidelines
                  </p>

                  <p className='text-muted small mb-1'>
                    <i className='bi bi-check2 me-2 text-success' />
                    JPG, PNG or WEBP format
                  </p>

                  <p className='text-muted small mb-1'>
                    <i className='bi bi-check2 me-2 text-success' />
                    Maximum image size 5 MB
                  </p>

                  <p className='text-muted small mb-0'>
                    <i className='bi bi-check2 me-2 text-success' />
                    Crop your face inside the circle
                  </p>
                </div>

                {selectedFile && (
                  <div className='mt-3'>
                    <Alert variant='info' className='small py-2'>
                      Cropped photo is ready to upload.
                    </Alert>

                    <Button
                      className='w-100'
                      onClick={handlePhotoUpload}
                      disabled={uploading}
                      style={{
                        backgroundColor: '#198754',
                        borderColor: '#198754',
                        borderRadius: '8px'
                      }}
                    >
                      {uploading ? (
                        <>
                          <Spinner size='sm' className='me-2' />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className='bi bi-cloud-arrow-up me-2' />
                          Upload Photo
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Personal Information Card */}
          <Col lg={7} className='mb-4'>
            <Card
              className='border-0 shadow-sm'
              style={{ borderRadius: '15px' }}
            >
              <Card.Body className='p-4 p-md-5'>
                <div className='d-flex align-items-center mb-4'>
                  <div
                    className='rounded-3 d-flex align-items-center justify-content-center me-3'
                    style={{
                      width: '45px',
                      height: '45px',
                      backgroundColor: '#E8EEF5',
                      color: '#142D4E'
                    }}
                  >
                    <i className='bi bi-person-lines-fill fs-4' />
                  </div>

                  <div>
                    <h5 className='fw-bold mb-1' style={{ color: '#142D4E' }}>
                      Personal Information
                    </h5>
                    <p className='text-muted small mb-0'>
                      Update your personal details below.
                    </p>
                  </div>
                </div>

                <hr className='mb-4' />

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className='mb-3'>
                      <Form.Label className='fw-semibold'>
                        First Name <span className='text-danger'>*</span>
                      </Form.Label>

                      <Form.Control
                        type='text'
                        name='firstName'
                        value={profile.firstName}
                        onChange={handleChange}
                        placeholder='Enter first name'
                        required
                        maxLength={50}
                        style={{ padding: '11px', borderRadius: '8px' }}
                      />
                    </Col>

                    <Col md={6} className='mb-3'>
                      <Form.Label className='fw-semibold'>Last Name</Form.Label>

                      <Form.Control
                        type='text'
                        name='lastName'
                        value={profile.lastName}
                        onChange={handleChange}
                        placeholder='Enter last name'
                        maxLength={50}
                        style={{ padding: '11px', borderRadius: '8px' }}
                      />
                    </Col>

                    <Col md={12} className='mb-3'>
                      <Form.Label className='fw-semibold'>
                        Mobile Number
                      </Form.Label>

                      <Form.Control
                        type='tel'
                        name='mobileNo'
                        value={profile.mobileNo}
                        onChange={handleChange}
                        placeholder='Enter 10-digit mobile number'
                        maxLength={10}
                        style={{ padding: '11px', borderRadius: '8px' }}
                      />
                      <Form.Text className='text-muted'>
                        Enter your 10-digit mobile number.
                      </Form.Text>
                    </Col>

                    <Col md={12} className='mb-3'>
                      <Form.Label className='fw-semibold'>
                        Email Address
                      </Form.Label>

                      <div className='position-relative'>
                        <Form.Control
                          type='email'
                          value={profile.email}
                          readOnly
                          disabled
                          style={{
                            padding: '11px',
                            borderRadius: '8px',
                            backgroundColor: '#F1F3F5'
                          }}
                        />
                      </div>

                      <Form.Text className='text-muted'>
                        <i className='bi bi-lock me-1' />
                        Your registered email cannot be changed.
                      </Form.Text>
                    </Col>
                  </Row>

                  <hr className='my-4' />

                  <div className='d-flex justify-content-end'>
                    <Button
                      type='submit'
                      disabled={saving}
                      className='px-4 py-2'
                      style={{
                        backgroundColor: '#142D4E',
                        borderColor: '#142D4E',
                        borderRadius: '8px'
                      }}
                    >
                      {saving ? (
                        <>
                          <Spinner size='sm' className='me-2' />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <i className='bi bi-check2-circle me-2' />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Circular Image Crop Modal */}
      <Modal
        show={showCropModal}
        onHide={closeCropModal}
        centered
        size='md'
        backdrop='static'
        contentClassName='border-0'
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: '#142D4E',
            color: 'white'
          }}
        >
          <Modal.Title className='fs-5 fw-bold'>
            <i className='bi bi-crop me-2' />
            Adjust Profile Photo
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className='p-4'>
          <p className='text-muted small text-center mb-3'>
            Drag your photo to position your face inside the circle.
          </p>

          <div
            className='position-relative mx-auto overflow-hidden'
            style={{
              height: '320px',
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#202020',
              borderRadius: '12px'
            }}
          >
            {cropImage && (
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape='round'
                showGrid={false}
                restrictPosition={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className='mt-4'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <Form.Label className='fw-semibold mb-0'>
                <i className='bi bi-zoom-in me-2' />
                Zoom
              </Form.Label>

              <span className='small text-muted'>{zoom.toFixed(1)}x</span>
            </div>

            <Form.Range
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
            />

            <div className='d-flex justify-content-between text-muted small'>
              <span>Zoom Out</span>
              <span>Zoom In</span>
            </div>
          </div>

          <div className='text-center mt-3'>
            <Button
              variant='outline-secondary'
              size='sm'
              onClick={() => {
                setCrop({ x: 0, y: 0 })
                setZoom(1)
              }}
            >
              <i className='bi bi-arrow-counterclockwise me-2' />
              Reset Position
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer className='border-0 px-4 pb-4'>
          <Button variant='light' onClick={closeCropModal} disabled={cropping}>
            Cancel
          </Button>

          <Button
            onClick={handleCropConfirm}
            disabled={cropping}
            style={{
              backgroundColor: '#142D4E',
              borderColor: '#142D4E'
            }}
          >
            {cropping ? (
              <>
                <Spinner size='sm' className='me-2' />
                Cropping...
              </>
            ) : (
              <>
                <i className='bi bi-check-circle me-2' />
                Apply Crop
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Profile

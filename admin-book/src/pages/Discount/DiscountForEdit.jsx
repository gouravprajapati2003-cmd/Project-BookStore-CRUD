import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL

function DiscountForEdit() {
    let params = useParams()
    let id = params.id
    useEffect(() => {
        axios({
            url: apiUrl + '/discount/for/edit/' + id,
            method: 'get',
        }).then(() => {

        }).catch((err) => {
            alert(err)
        })
    }, [])
    return(
        <h1>We will the Edit Discount Here</h1>
    )
}

export default DiscountForEdit;
import { useState, useEffect } from "react";
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL

function MyOrder() {
    let [myOrders, setMyOrders] = useState([])
    useEffect(() => {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
        if(isLoggedIn) {
            let email = localStorage.getItem('email')
            axios({
                url: apiUrl + '/my/orders',
                method: 'get'
            }).then((res) => {
                setMyOrders(res.data.data)
            }).catch((err) => {
                alert(err)
            })
        } else {
            alert('Please Login to view Yours Orders..')
        }
    }, [])
    return(
        <h1>My Order</h1>
    )
}
export default MyOrder;
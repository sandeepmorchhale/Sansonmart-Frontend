import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Userregister from '../pages/auth/Userregister'
import Userlogin from '../pages/auth/Userlogin'
import Homepage from '../pages/genral/Homepage'
import Adminloginpage from '../pages/admin/Adminloginpage'
import Admindeshboard from '../pages/admin/Admindeshboard'
import Adminlistings from '../pages/admin/Adminlistings'
import Admineditproducts from '../pages/admin/Admineditproducts'
import UserCart from '../pages/userpages/UserCart'
import UserChat from '../pages/userpages/UserChat'
import UserOrders from '../pages/userpages/UserOrders'
import UserProductPage from '../pages/userpages/UserProductPage.jsx'
import AdminMsg from '../pages/admin/AdminMsg.jsx'
import AdminOrders from '../pages/admin/AdminOrders.jsx'
import AdminProtectedRoute from '../pages/admin/AdminProtectedRoute.jsx'
import UserProtactedRoute from '../pages/userpages/UserProtactedRoute.jsx'
import UserConformation from '../pages/userpages/UserConformation.jsx'

const Approutes = () => {
  return (


    <>

      <Router>
        <Routes>

          {/* user routes */}

          <Route path='/' element={<Homepage />} />
          <Route path='/user/register' element={<Userregister />} />
          <Route path='/user/login' element={<Userlogin />} />


          <Route element={<UserProtactedRoute />} >


            <Route path='/user/product' element={<UserProductPage />} />
            <Route path='/user/cart' element={<UserCart />} />
            <Route path='/user/chat' element={<UserChat />} />
            <Route path='/user/order' element={<UserOrders />} />
            <Route path='/user/conformation' element={<UserConformation />} />

          </Route>



          {/* admin routes */}


          <Route path='/admin/login' element={<Adminloginpage />} />
          <Route element={<AdminProtectedRoute />}>

            <Route path='/admin/orders' element={<AdminOrders />} />
            <Route path='/admin/deshboard' element={<Admindeshboard />} />
            <Route path='/admin/listings' element={<Adminlistings />} />
            <Route path='/admin/editproducts' element={<Admineditproducts />} />
            <Route path='/admin/message' element={<AdminMsg />} />



          </Route>
        </Routes>
      </Router>


    </>


  )
}

export default Approutes
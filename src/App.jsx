import React, { useState, useEffect } from 'react'
import './App.css'
import Logo from './assets/Logo.png'
import { Form, Button, FloatingLabel, Alert } from 'react-bootstrap'
import { FaMagnifyingGlass, FaCartShopping, FaCopy } from "react-icons/fa6"
import { collection, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from './firebase'

function App() {
  const [error, setError] = useState("")
  const [account, setAccount] = useState("")
  const [data, setData] = useState([])
  const [check, setCheck] = useState(null)
  const [filteredData, setFilteredData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const orderRef = collection(db, "orders");

  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    }
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(newData)
    })
    return () => {
      unsubscribe();
    }
  }

  const validatePassForm = () => {
    let errors = {};
    let isValid = true;
    if (!account) {
      errors.account = "กรุณากรอกข้อมูล";
      isValid = false;
    }
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (validatePassForm()) {
      try {
        const filtered = data.filter((item) => item.account === account);
        setCheck(filtered.length > 0);
        setFilteredData(filtered);
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    }
  }

  // console.log(data);

  const handleCopyTrackingNumber = (trackingNumber) => {
    navigator.clipboard.writeText(trackingNumber);
  }

  return (
    <>
      <div className='mx-5 mt-5'>
        <div className="row">
          <div className="col-md-5 mx-auto">
            <div className='p-4 flex items-center justify-center'>
              <img src={Logo} alt="Logo" />
            </div>
            <h3 className='mt-5 mb-3'>ระบุ Twitter Account ( ใส่ @ หน้า account )</h3>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-3' controlId='formBasicAccount'>
                <FloatingLabel
                  controlId="formBasicAccount"
                  label="Twitter Account"
                  className="mb-3"
                >
                  <Form.Control
                    type='text'
                    name="account"
                    placeholder='Twitter Account'
                    onChange={(e) => setAccount(e.target.value)}
                    isInvalid={fieldErrors.account}
                  />
                  <Form.Control.Feedback type="invalid">{fieldErrors.account}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              <div className="d-grid gap-2">
                <Button className='btn btn-secondary' type='submit'>
                  <FaMagnifyingGlass />ค้นหา
                </Button>
              </div>
            </Form>
            {check ? (
              <div className="card w-70 bg-base-100 shadow-xl mt-4 mb-4 px-4 pt-4 text-sm">
                {filteredData.map((item, index) => (
                  <div className='text-left' key={index}>
                    <div className='mb-1'>{item.account}</div>
                    <div className='mb-1 font-semibold flex justify-start'><FaCartShopping className='icon-large' />: {item.name}</div>
                    <div className='mb-1'>จำนวน : {item.amount} </div>
                    <div className='mb-1'>จำนวนเงินค้างชำระ : {item.value ? Number(item.value).toLocaleString() : item.value} บาท</div>
                    <div className='mb-1'>รอบพรีออเดอร์ : {item.about}</div>
                    <div className='mb-1'>สถานะสินค้า : {item.status}</div>
                    <div>
                      เลขพัสดุ : {item.trackingNumber} <Button className='btn btn-xs' onClick={() => handleCopyTrackingNumber(item.trackingNumber)}>คัดลอก</Button>
                    </div>
                    <br />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {account && filteredData ? (
                  <h2 className='text-rose-600 font-medium mt-4'>ไม่พบ Twitter Account โปรดตรวจสอบและค้นหาอีกครั้ง</h2>
                ) : (null)}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App

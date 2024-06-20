import React, { useState, useEffect } from 'react'
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom'
import { onSnapshot, collection, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore'
import { Form, Alert, Button, FloatingLabel } from 'react-bootstrap'
import { FaRegTrashCan } from "react-icons/fa6"

function Edit() {
    const { id } = useParams();

    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        id: "",
        account: "",
        name: "",
        amount: "",
        value: "",
        about: "",
        status: "",
        trackingNumber: "",
    });
    const [dataSelect, setDataSelect] = useState([]);
    const [check, setCheck] = useState(null);
    const [status, setStatus] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(null);

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

    useEffect(() => {
        const filteredData = data.find(item => item.id === id);
        if (filteredData) {
            setFormData({
                id: filteredData.id || "",
                account: filteredData.account || "",
                name: filteredData.name || "",
                amount: filteredData.amount || "",
                value: filteredData.value || "",
                about: filteredData.about || "",
                status: filteredData.status || "",
                trackingNumber: filteredData.trackingNumber || ""
            });
        }
    }, [data]);

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await updateDoc(doc(orderRef, formData.id), {
                account: formData.account,
                name: formData.name,
                amount: formData.amount,
                value: formData.value,
                about: formData.about,
                status: formData.status,
                trackingNumber: formData.trackingNumber,
            });
            navigate("/home");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await deleteDoc(doc(db, "orders", formData.id));
            navigate("/home");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    const handleShow = async (e) => {
        e.preventDefault();
        if (check) {
            setCheck(null);
        } else {
            setCheck(true);
        }
    }

    const handleStatus = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await addDoc(collection(db, 'status'), {
                status
            });
            setStatus("");
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    }

    const statusRef = collection(db, "status");
    useEffect(() => {
        const unsubscribe = loadRealtimeStatus();
        return () => {
            unsubscribe();
        }
    }, []);

    const loadRealtimeStatus = () => {
        const unsubscribe = onSnapshot(statusRef, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setDataSelect(newData)
        })
        return () => {
            unsubscribe();
        }
    }

    if (deleteStatus) {
        deleteDoc(doc(db, "status", deleteStatus));
        setDeleteStatus(null);
    }

    return (
        <div className='mx-5 mt-4'>
            <div className="row">
                <div className="col-md-5 mx-auto">
                    <h2 className='mb-3 text-2xl'>แก้ไขรายการสั่งซื้อ</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3' controlId='formBasicAccount'>
                            <FloatingLabel
                                controlId="formBasicAccount"
                                label="Account twitter"
                                className="mb-3"
                            >
                                <Form.Control
                                    type='text'
                                    name='account'
                                    placeholder='Account twitter'
                                    value={formData.account}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formBasicName'>
                            <FloatingLabel
                                controlId="formBasicName"
                                label="ชื่อสินค้า"
                                className="mb-3"
                            >
                                <Form.Control
                                    type='text'
                                    name='name'
                                    placeholder='ชื่อสินค้า'
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formBasicAmount'>
                            <FloatingLabel
                                controlId="formBasicAmount"
                                label="จำนวน"
                                className="mb-3"
                            >
                                <Form.Control
                                    type='text'
                                    name='amount'
                                    placeholder='จำนวน'
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formBasicValue'>
                            <FloatingLabel
                                controlId="formBasicValue"
                                label="จำนวนเงินค้างชำระ"
                                className="mb-3"
                            >
                                <Form.Control
                                    type='text'
                                    name='value'
                                    placeholder='จำนวนเงินค้างชำระ'
                                    value={formData.value}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formBasicAbout'>
                            <FloatingLabel
                                controlId="formBasicAbout"
                                label="รอบพรีออเดอร์"
                                className="mb-3"
                            >
                                <Form.Control
                                    type='text'
                                    name='about'
                                    placeholder='รอบพรีออเดอร์'
                                    value={formData.about}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className='mb-3 flex flex-row' controlId='formBasicStatus'>
                            {check ? (
                                <>
                                    <FloatingLabel
                                        controlId="formBasicStatus"
                                        label="สถานะสินค้า"
                                        className="mb-3 basis-5/6"
                                    >
                                        <Form.Control
                                            type='text'
                                            placeholder='สถานะสินค้า'
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <Button className='mt-2 ml-2' onClick={handleStatus}>บันทึก</Button>
                                    <Button className='mt-2 ml-2' onClick={handleShow}>เสร็จสิ้น</Button>
                                </>
                            ) : (
                                <>
                                    <FloatingLabel
                                        controlId="formBasicStatus"
                                        label="สถานะสินค้า"
                                        className="mb-3 basis-5/6"
                                    >
                                        <Form.Select aria-label="สถานะสินค้า" name='status' onChange={handleChange} value={formData.status}>
                                            <option>กรุณาเลือก</option>
                                            {dataSelect.map((item, index) => (
                                                <option key={index} value={item.status}>{item.status}</option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                    <Button className='mt-2 ml-2' onClick={handleShow}>แก้ไขสถานะ</Button>
                                </>
                            )}
                        </Form.Group>

                        {check ? (
                            <div className=''>
                                <div className="card max-w-96 bg-base-100 shadow-xl mb-3">
                                    <div className="card-body">
                                        <h2 className="card-title">สถานะของสินค้า</h2>
                                        <table>
                                            <tbody>
                                                {dataSelect.map((item, index) =>
                                                    <tr key={index}>
                                                        <td className='text-left' key={index}>{item.status}</td>
                                                        <td className='flex justify-end items-end'>
                                                            <Button className='m-1' onClick={() => setDeleteStatus(item.id)}>
                                                                <FaRegTrashCan />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (null)}

                        <Form.Group className='mb-3' controlId='formBasicTrackingNumber'>
                            <FloatingLabel
                                controlId="formBasicTrackingNumber"
                                label="เลขพัสดุ"
                                className="mb-3"
                            >
                                <Form.Control
                                    type='text'
                                    name='trackingNumber'
                                    placeholder='เลขพัสดุ'
                                    value={formData.trackingNumber}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        {check ? (
                            null
                        ) : (
                            <div className="d-grid gap-2">
                                <Button className='btn btn-secondary' type='submit'>บันทึกข้อมูล</Button>
                            </div>
                        )}
                    </Form>

                    {check ? (null) : (<Button className='btn btn-outline btn-error mt-3 mb-3' onClick={handleDelete}>ลบข้อมูล</Button>)}
                </div>
            </div>
        </div>
    )
}

export default Edit
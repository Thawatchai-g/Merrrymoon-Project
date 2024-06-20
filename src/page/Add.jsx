import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { Form, Alert, Button, FloatingLabel } from 'react-bootstrap'
import { FaRegTrashCan } from "react-icons/fa6"

function Add() {

    const [account, setAccount] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [value, setValue] = useState("");
    const [about, setAbout] = useState("");
    const [status, setStatus] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [error, setError] = useState("");
    const [check, setCheck] = useState(null);
    const [data, setData] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState(null);

    const statusRef = collection(db, "status");
    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            unsubscribe();
        }
    }, []);

    const loadRealtime = () => {
        const unsubscribe = onSnapshot(statusRef, (snapshot) => {
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

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await addDoc(collection(db, 'orders'), {
                account,
                name,
                amount,
                value,
                about,
                status,
                trackingNumber,
            });
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

    if (deleteStatus) {
        deleteDoc(doc(db, "status", deleteStatus));
        setDeleteStatus(null);
    }

    return (
        <div className='mx-5 mt-4'>
            <div className="row">
                <div className="col-md-5 mx-auto">
                    <h2 className='mb-3 text-xl'>เพิ่มรายการสั่งซื้อ</h2>
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
                                    placeholder='Account twitter'
                                    onChange={(e) => setAccount(e.target.value)}
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
                                    placeholder='ชื่อสินค้า'
                                    onChange={(e) => setName(e.target.value)}
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
                                    placeholder='จำนวน'
                                    onChange={(e) => setAmount(e.target.value)}
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
                                    placeholder='จำนวนเงินค้างชำระ'
                                    onChange={(e) => setValue(e.target.value)}
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
                                    placeholder='รอบพรีออเดอร์'
                                    onChange={(e) => setAbout(e.target.value)}
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
                                        <Form.Select aria-label="สถานะสินค้า" onChange={(e) => setStatus(e.target.value)}>
                                            <option>กรุณาเลือก</option>
                                            {data.map((item, index) => (
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
                                                {data.map((item, index) =>
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
                                    placeholder='เลขพัสดุ'
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        {check ? (
                            null
                        ) : (
                            <div className="d-grid gap-2">
                                <Button className='btn btn-secondary' type='submit'>เพิ่มข้อมูล</Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Add
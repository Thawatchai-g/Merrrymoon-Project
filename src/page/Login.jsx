import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button, FloatingLabel } from 'react-bootstrap'
import { useUserAuth } from '../context/UserAuthContext'

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  return (
    <div className='m-5'>
      <div className="row">
        <div className="col-md-5 mx-auto">
          <h2 className='mb-3 text-xl'>เข้าสู่ระบบ</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel
                controlId="formBasicEmail"
                label="อีเมล"
                className="mb-3"
              >
                <Form.Control
                  type='email'
                  placeholder='อีเมล'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <FloatingLabel
                controlId="formBasicPassword"
                label="รหัสผ่าน"
                className="mb-3"
              >
                <Form.Control
                  type='password'
                  placeholder='รหัสผ่าน'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button className='btn btn-secondary' type='submit'>เข้าสู่ระบบ</Button>
            </div>
          </Form>
          <div className='mt-3'>
            <Link to="/">หน้าหลัก</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
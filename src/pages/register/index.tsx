
import './index.css';
import React, { useState, ChangeEvent } from 'react';
import { Form, Button, Container, Row, Col, InputGroup, Card, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { userSendOTP } from '../../api/user/sendOtp';
import { userSendRegister } from '../../api/user/register';

export interface FormData {
    corporateId?: string
    corporateName?: string
    userId?: string
    userName?: string
    role?: string
    phoneNumber?: string
    email?: string
    verifCode?: string
    password?: string
}

export interface SendOtp {
    email?: string
    userName?: string
}

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitOTP, setIsSubmitOTP] = useState(false);
    const [isSubmitRegister, setIsSubmitRegister] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState<FormData>({});
    const [formError, setFormError] = useState<FormData>({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const closeErrorModal = () => {
        setShowModal(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
    
        setFormError({
            ...formError,
            [name]: false
        })
    };

    const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
    
        setFormError({
            ...formError,
            [name]: false
        })
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError({});
        setIsSubmitOTP(true);
        const body: SendOtp = {
            email: formData.email,
            userName: formData.userName,
        }
        
        await sendOTP(body);
        setIsSubmitOTP(false);
    };

    const handleSendRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError({});
        setIsSubmitRegister(true);
        setIsSubmitOTP(true);

        await sendRegister(formData);

        setIsSubmitRegister(false);
        setIsSubmitOTP(false);
    }

    const sendOTP = async (body: SendOtp) => {
        const response = await userSendOTP(body);
        if (response && response.code === 422) {
            const validationError: FormData = {};
            response.data.forEach((error: any) => {
                const fieldName = error.path[0] as keyof FormData;
                validationError[fieldName] = error.message;
            });
            
            setFormError(validationError)
            return
        }

        if (response && response.code === 200) {
            setErrorMsg('Berhasil Send OTP');
            setShowModal(true);
        }

        setErrorMsg(response.message || response)
        setShowModal(true);
    };

    const sendRegister = async (body: FormData) => {
        const response = await userSendRegister(body);
        if (response && response.code === 422) {
            const validationError: FormData = {};
            response.data.forEach((error: any) => {
                const fieldName = error.path[0] as keyof FormData;
                validationError[fieldName] = error.message;
            });
            
            setFormError(validationError)
            return
        }

        if (response && response.code === 200) {
            setErrorMsg('Berhasil Register');
            setShowModal(true);
            return navigate('/');
        }

        setErrorMsg(response.message || response)
        setShowModal(true);
    };

    return (
        <Container className='d-flex align-items-center justify-content-center min-vh-100'>
            <Row className='justify-content-md-center w-100'>
                <Col md={6}>
                    <Card className='p-4'>
                        <Card.Body>
                            <Form onSubmit={handleSendRegister}>
                                <Form.Group controlId='formCorporateId' className='mb-3'>
                                    <Form.Label>Corporate Account No.</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Corporate Account No.'
                                        name='corporateId'
                                        value={formData.corporateId}
                                        onChange={handleChange}
                                        isInvalid={!!formError.corporateId}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formError.corporateId}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId='formCorporateName' className='mb-3'>
                                    <Form.Label>Corporate Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Corporate Name'
                                        name='corporateName'
                                        value={formData.corporateName}
                                        onChange={handleChange}
                                        isInvalid={!!formError.corporateName}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formError.corporateName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId='formUserId' className='mb-3'>
                                    <Form.Label>User ID</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='User ID'
                                        name='userId'
                                        value={formData.userId}
                                        onChange={handleChange}
                                        isInvalid={!!formError.userId}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formError.userId}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId='formUserName' className='mb-3'>
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='User Name'
                                        name='userName'
                                        value={formData.userName}
                                        onChange={handleChange}
                                        isInvalid={!!formError.userName}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formError.userName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId='formRole' className='mb-3'>
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select 
                                        name='role'
                                        value={formData.role}
                                        onChange={handleChangeSelect}
                                        isInvalid={!!formError.role}
                                    >
                                        <option value=''>Role</option>
                                        <option value='Maker'>Maker</option>
                                        <option value='Approver'>Approver</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type='invalid'>
                                        {formError.role}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId='formPhoneNumber' className='mb-3'>
                                    <Form.Label>Phone No.</Form.Label>
                                    <InputGroup>
                                        <Form.Select
                                            name="countryCode"
                                            defaultValue="+62"
                                            style={{ maxWidth: '100px' }}
                                        >
                                            <option value="+62">+62</option>
                                        </Form.Select>
                                        <Form.Control
                                            type='text'
                                            placeholder='Phone No.'
                                            name='phoneNumber'
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            isInvalid={!!formError.phoneNumber}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formError.phoneNumber}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId='formEmail' className='mb-3'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!formError.email}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formError.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId='formPassword' className='mb-3'>
                                    <Form.Label>Login Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Login password'
                                            name='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                            isInvalid={!!formError.password}
                                        />
                                        <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                            {showPassword ? '🙈' : '👁️'}
                                        </InputGroup.Text>
                                        <Form.Control.Feedback type='invalid'>
                                            {formError.password}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group controlId='formVerifCode' className='mb-3'>
                                    <Form.Label>Verification Code</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type='text'
                                            placeholder='Verification Code'
                                            name='verifCode'
                                            value={formData.verifCode}
                                            onChange={handleChange}
                                            isInvalid={!!formError.verifCode}
                                        />
                                        <Button onClick={handleSendOTP} variant='secondary' disabled={isSubmitOTP || !formData.email || !formData.userName}>
                                            Send OTP Code
                                        </Button>
                                        <Form.Control.Feedback type='invalid'>
                                            {formError.verifCode}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                
                                <Button variant="warning" type="submit" className="w-100" disabled={isSubmitRegister}>
                                    Register
                                </Button>
                            </Form>
                            <div className='text-center mt-3'>
                                Already have an account? <Link to="/">Login Now</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={closeErrorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMsg}</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={closeErrorModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default RegisterForm;

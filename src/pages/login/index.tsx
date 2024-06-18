import React, { useState, ChangeEvent, useEffect } from 'react';
import { Form, Button, Container, Row, Col, InputGroup, Card, Modal } from 'react-bootstrap';
import './index.css';
import { userLogin } from '../../api/user/login';
import { Link, useNavigate } from 'react-router-dom';
import { localStorageKey } from '../constanta';

export interface FormData {
    corporateId?: string;
    userId?: string;
    password?: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState<FormData>({});
  const [formError, setFormError] = useState<FormData>({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    const handleCloseErrorModal = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError({});

    setIsSubmitting(true);

    await login(formData);

    setIsSubmitting(false);
  }

  const login = async (data: FormData) => {
        const response = await userLogin(data)
        if (response && response.code === 422) {
            const validationError: FormData = {};
            response.data.forEach((error: any) => {
                const fieldName = error.path[0] as keyof FormData;
                validationError[fieldName] = error.message;
            });
            
            setFormError(validationError)
            return
        }

        if(response && response.code === 200) {
            setErrorMsg('Berhasil masuk');
            setShowModal(true);
            localStorage.setItem(localStorageKey.JWT, response.data);
            navigate('/dashboard/home');
        }

        setErrorMsg(response.message || response)
        setShowModal(true);
  }

  useEffect(() => {
    localStorage.removeItem(localStorageKey.USER_DATA);
    localStorage.removeItem(localStorageKey.JWT);
  })

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-md-center w-100">
        <Col md={6}>
          <Card className="p-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCorporateId" className="mb-3">
                  <Form.Label>Corporate Account No.</Form.Label>
                  <Form.Control type="text" placeholder="Corporate Account No." name="corporateId" value={formData.corporateId} onChange={handleChange} isInvalid={!!formError.corporateId} />
                  <Form.Control.Feedback type="invalid">
                    {formError.corporateId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formUserId" className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control type="text" placeholder="User ID" name="userId" value={formData.userId} onChange={handleChange} isInvalid={!!formError.userId} />
                  <Form.Control.Feedback type="invalid">
                    {formError.userId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Login password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Login password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!formError.password}
                    />
                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      {showPassword ? '🙈' : '👁️'}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                        {formError.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button variant="warning" type="submit" className="w-100" disabled={isSubmitting}>
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                Without Account? <Link to="/register">Register Now</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    <Modal show={showModal} onHide={handleCloseErrorModal}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorMsg}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseErrorModal}>
                    Close
                </Button>
            </Modal.Footer>
    </Modal>

    </Container>
  );
};

export default LoginForm;

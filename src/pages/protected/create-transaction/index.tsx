import React from 'react'
import Dashboard from '../dashboard'
import { Card, Container, Form, Button, Col, Row } from 'react-bootstrap'
import styles from './transaction.module.css'

function CreateTransaction() {
    return (
        <Dashboard>
            <div className={styles.overviewContainer}>
                <Card className={styles.card}>
                    <Card.Header> 
                        <h3 className={styles.cardHeader}>Please enter transfer information</h3>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="formTemplate">
                            <Form.Label>Choose Your Template</Form.Label>
                            <div className="border p-4 text-center" style={{ borderRadius: '5px', borderStyle: 'dashed' }}>
                                <p>Only xls or xlsx format is support</p>
                                <Button variant="link">Download Template</Button>
                            </div>
                            </Form.Group>

                            <Form.Group controlId="formInstructionType" className="mt-4">
                            <Form.Label>Instruction Type</Form.Label>
                            <div>
                                <Form.Check 
                                type="radio" 
                                label="Immediate" 
                                name="instructionType" 
                                id="immediate" 
                                inline 
                                />
                                <Form.Check 
                                type="radio" 
                                label="Standing Instruction" 
                                name="instructionType" 
                                id="standingInstruction" 
                                inline 
                                />
                            </div>
                            </Form.Group>

                            <Form.Group controlId="formTotalTransferRecord" className="mt-4">
                            <Form.Label>Total Transfer Record</Form.Label>
                            <Form.Control type="text" placeholder="Please Input" />
                            </Form.Group>

                            <Form.Group controlId="formTransferAmount" className="mt-4">
                            <Form.Label>Transfer Amount</Form.Label>
                            <Form.Control type="text" placeholder="Rp Please Input amount" />
                            </Form.Group>

                            <div className="text-center mt-4">
                            <Button variant="warning" type="submit" className={styles.button}>
                                Next
                            </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Dashboard>
    );
};

export default CreateTransaction
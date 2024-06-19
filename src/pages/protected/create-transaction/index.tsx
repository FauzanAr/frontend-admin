import React, { ChangeEvent, useEffect, useState } from 'react'
import Dashboard from '../dashboard'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import styles from './transaction.module.css'
import { GetUserByAccount, getUserByAccount } from '../../../api/user/getUser'
import { localStorageKey } from '../../constanta'
import Response from '../../../api/response';
import { CreateTranasction, createTransaction } from '../../../api/transaction/createTransaction'

function CreateTransaction() {
    const object = localStorage.getItem(localStorageKey.USER_DATA) ? JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || '') : {};
    const[user, setUser] = useState(object);
    const[totalRecords, setTotalRecords] = useState(0);
    const[records, setRecords] = useState<any>([]);
    const[showDateTimeInput, setShowDateTimeInput] = useState(false);
    const[dateTimeValue, setDateTimeValue] = useState('');
    const[accountNo, setAccountNo] = useState('');
    const[instructionType, setInstructionType] = useState('');
    const[showConfirmation, setShowConfirmation] = useState(false);
    const[showSuccess, setShowSuccess] = useState(false);
    const[totalAmount, setTotalAmount] = useState(0);
    const[destinationUserId, setDestinationUserId] = useState('');
    const[result, setResult] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'Maker') {
            navigate('/dashboard/home');
            return
        }
    })

    const handleTotalRecordsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setTotalRecords(value);
        setRecords(Array(value).fill(''))
    };

    const handleRecordChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        let newRecords = [...records]
        newRecords[index] = e.target.value;
        setRecords(newRecords)
    }

    const handleInstructionTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInstructionType(e.target.value)
        setShowDateTimeInput(e.target.value === 'STANDING');
    };

    const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            alert('Tanggal yang di pilih tidak boleh kurang dari hari & jam ini');
            setDateTimeValue('');
        } else {
            setDateTimeValue(e.target.value);
        }
    }

    const handleAccountNoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAccountNo(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let tmp = 0;
        records.map((data: string) => tmp += Number(data)) 
        setTotalAmount(tmp);

        const query: GetUserByAccount = {
            accountNo: accountNo,
            token: localStorage.getItem(localStorageKey.JWT) || '',
        }
        const result: Response = await getUserByAccount(query)
        if (result.code === 401) {
            localStorage.removeItem(localStorageKey.JWT);
        }

        if (!result.data) {
            // Will be handle and bautify
            alert('Error no account data');
            return;
        }

        setDestinationUserId(result.data.id);
        setShowConfirmation(true);
    }

    const handleConfirm = async () => {
        const transactionData: CreateTranasction = {
            token: localStorage.getItem(localStorageKey.JWT) || '',
            instruction: instructionType,
            transferAt: dateTimeValue,
            transactionList: records.map((data: string) => {
                return {
                    amount: Number(data),
                    userDestinationId: destinationUserId.toString(),
                    corporateDestinationId: accountNo,
                }
            }),
        };

        const result: Response = await createTransaction(transactionData);
        if (result.code === 401) {
            localStorage.removeItem(localStorageKey.JWT)
            setUser({});
        }

        if (!result.success) {
            // Will beauty
            setShowSuccess(false)
            setShowConfirmation(false)
            alert(result.message)
            return
        }
        
        setResult(result.data);
        setShowSuccess(true);
    }

    const handleBack = () => {
        setShowSuccess(false);
        setShowConfirmation(false);
    }

    const handleHome = () => {
        return navigate('/dashboard/home');

    }

    const numberFormat = (number: number) => {
        return new Intl.NumberFormat('id', {
            style: 'currency',
            currency: 'IDR'
        }).format(number)
    }
    return (
        <Dashboard>
            <div className={styles.overviewContainer}>
                {!showConfirmation && !showSuccess && (
                    <Card className={styles.card}>
                        <Card.Header> 
                            <h3 className={styles.cardHeader}>Please enter transfer information</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
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
                                        value="IMMEDIATE"
                                        onChange={handleInstructionTypeChange}
                                    />
                                    <Form.Check 
                                        type="radio" 
                                        label="Standing Instruction" 
                                        name="instructionType" 
                                        id="standingInstruction" 
                                        inline
                                        value="STANDING"
                                        onChange={handleInstructionTypeChange}
                                    />
                                </div>
                                </Form.Group>

                                {showDateTimeInput && (
                                    <Form.Group 
                                        controlId="formDateTime"
                                        className="mt-4"
                                    >
                                        <Form.Label>Date and Time</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={dateTimeValue}
                                            onChange={handleDateTimeChange}
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group controlId="formTotalTransferRecord" className="mt-4">
                                    <Form.Label>Account No.</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Account No."
                                        value={accountNo}
                                        onChange={handleAccountNoChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTotalTransferRecord" className="mt-4">
                                    <Form.Label>Total Transfer Record</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Please Input"
                                        value={totalRecords}
                                        onChange={handleTotalRecordsChange}
                                    />
                                </Form.Group>

                                {records.map((record: any, index: number) => (
                                    <Form.Group controlId={`formTransferRecord${index}`} className="mt-4" key={index}>
                                        <Form.Label>Transfer Amount {index + 1}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Rp | Please Input"
                                            value={record}
                                            onChange={(e: any) => handleRecordChange(index, e)}
                                        />
                                    </Form.Group>
                                ))}

                                <div className="text-center mt-4">
                                <Button variant="warning" type="submit" className={styles.button}>
                                    Next
                                </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                )}

                {showConfirmation && !showSuccess && (
                    <Card className={styles.card}>
                        <Card.Header>
                            <p>Total Transfer Record: <b>{records.length}</b></p>
                            <p>Total Transfer Amount: <b>{numberFormat(Number(totalAmount))}</b></p>
                            <p>From Account No: <b>{accountNo}</b></p>
                            <p>Instruction Type: <b>{instructionType}</b></p>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mt-4">
                                <Button variant="warning" onClick={handleConfirm}>
                                    Confirm
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                )}
                {showSuccess && (
                    <div className="text-center">
                        <Alert variant="success" className="cardHeader">
                            <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-3">Submitted successfully, waiting for review</h4>
                            <p>The transfer application will be invalidated on 23:59, please notify approver for review in time</p>
                        </Alert>
                        <div className="transactionDetails text-start mt-4 p-3">
                            <p><strong>Total Transfer Record:</strong> {result.totalTransfer}</p>
                            <p><strong>Total Transfer Amount:</strong> {numberFormat(Number(result.totalAmount))}</p>
                            <p><strong>From Account No.:</strong> {result.issuerId}</p>
                            <p><strong>Instruction Type:</strong> {result.instruction}</p>
                            <p><strong>Transfer Type:</strong> {result.type}</p>
                            <p><strong>Reference No.:</strong> {result.referenceId}</p>
                        </div>
                        <div className="buttonConfirmation mt-4">
                            <Button variant="warning" className="me-2" onClick={handleBack}>Transfer One More Time</Button>
                            <Button variant="light" onClick={handleHome}>Back Home</Button>
                        </div>
                    </div>
                )}
            </div>
        </Dashboard>
    );
};

export default CreateTransaction
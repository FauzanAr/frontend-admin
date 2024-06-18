import { Button, Modal, Spinner } from 'react-bootstrap';
import styles from './overview.module.css';
import Dashboard from '../dashboard';
import { useEffect, useState } from 'react';
import { countTransaction } from '../../../api/transaction/countTransaction';
import Response from '../../../api/response';
import { getTransactions } from '../../../api/transaction/getTransactions';
import _ from 'lodash';
import { getUser } from '../../../api/user/getUser';
import { localStorageKey } from '../../constanta';
import { CheckCircle, Eye, SlashCircle } from 'react-bootstrap-icons';
import moment from 'moment';
import { updateTransactions } from '../../../api/transaction/updateTransaction';

interface CountData {
  pending: number
  approved: number
  rejected: number
}

interface Transaction {
  id: number
  referenceId: string
  issuerId: number
  corporateId: number
  totalAmount: string
  status: string
  type: string
  instruction: string
  transferAt: string
  createdAt: string
  updatedAt: string
  TransactionList?: TransactionList[]
  issuer: {
    name: string
  }
  corporate: {
    name: string
  }
}

interface TransactionList {
  id: number
  transactionId: number
  amount: string
  userDestinationId: number
  corporateDestinationId: number
  corporateDestination: {
    name: string
  }
  userDestination: {
    name: string
  }
}

const Overview = () => {
  const object = localStorage.getItem(localStorageKey.USER_DATA) ? JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || '') : {};
  const [user, setUser] = useState(object);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [countData, setCountData] = useState<CountData>({
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [transactionData, setTransactionData] = useState<Transaction[]>([{
    id: 0,
    corporate: {name: ''},
    corporateId: 0,
    createdAt: '',
    instruction: '',
    issuer: {name: ''},
    issuerId: 0,
    referenceId: '',
    status: '',
    totalAmount: '',
    transferAt: '',
    type: '',
    updatedAt: '',
    TransactionList: []
  }]);

  const handleShowModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false)
  };

  const handleClick = async (id: number, status: string) => {
    setLoadingFetch(true);
    const transaction: Response = await updateTransactions({
      id: id,
      status: status,
      token: localStorage.getItem(localStorageKey.JWT) || ''
    });

    if (transaction.code === 401) {
      localStorage.removeItem(localStorageKey.JWT);
    }

    setLoadingFetch(false);
    setTriggerFetch(prev => !prev)
  }

  const numberFormat = (number: number) => {
    return new Intl.NumberFormat('id', {
      style: 'currency',
      currency: 'IDR'
    }).format(number)
  }

  useEffect(() => {
    setLoading(true);
    setLoadingFetch(true);
    if (_.isEmpty(user)) {
      getUser({token: localStorage.getItem(localStorageKey.JWT) || ''})
        .then((res: Response) => {
          if (res.success) {
            localStorage.setItem(localStorageKey.USER_DATA, JSON.stringify(res.data))
            setUser(res.data);
          }
        })
    }

    countTransaction({token: localStorage.getItem(localStorageKey.JWT) || ''})
      .then((data: Response) => {
        if (data.success) {
          const result: CountData = data.data
          setCountData(result);
        }

        if (data.code === 401) {
          localStorage.removeItem(localStorageKey.JWT);
        }

        setLoading(false);
      });

    getTransactions({token: localStorage.getItem(localStorageKey.JWT) || ''})
      .then((data: Response) => {
        if (data.success) {
          const result: Transaction[] = data.data
          setTransactionData(result);
        }

        setLoadingFetch(false)
      })

  }, [triggerFetch]);
  return (
    <Dashboard>
      <div className={styles.overviewContainer}>
        <h5>Transaction Overview</h5>
        <div className={styles.statusCard}>
          <h6 className={styles.cardText}>Awaiting approval</h6>
          <h2 className={styles.pendingText}>
            {loading ? (
              <Spinner animation="border" size="sm"/>
            ) : (
              countData.pending
            )}
          </h2>
        </div>
        <div className={styles.statusCard}>
          <h6 className={styles.cardText}>Successfully</h6>
          <h2 className={styles.acceptText}>
            {loading ? (
              <Spinner animation="border" size="sm"/>
            ) : (
              countData.approved
            )}
          </h2>
        </div>
        <div className={styles.statusCard}>
          <h6 className={styles.cardText}>Rejected</h6>
          <h2 className={styles.rejectText}>
            {loading ? (
              <Spinner animation="border" size="sm"/>
            ) : (
              countData.rejected
            )}
          </h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference No.</th>
                <th>Total Transfer Amount(Rp)</th>
                <th>Total Transfer Record</th>
                <th>From Account No.</th>
                <th>Maker</th>
                <th>Transfer Date</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {loadingFetch ? (
                <tr>
                <td colSpan={7} className="text-center">
                  <Spinner animation="border" size="sm" className={styles.spinner} />
                </td>
              </tr>
              ) : (
                <>
                  {transactionData.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.referenceId}</td>
                      <td>{transaction.totalAmount}</td>
                      <td>{transaction.TransactionList?.length}</td>
                      <td>{transaction.corporateId}</td>
                      <td>{transaction.issuer?.name}</td>
                      <td>{moment(transaction.createdAt).format('DD MMM, YYYY')}</td>
                      <td>
                        {
                          user.role === 'Maker' ? (
                            <div className={styles.buttonContainer}>
                              <button className={styles.iconButton} onClick={() => handleShowModal(transaction)}>
                                <Eye className={styles.icon} />
                                Detail
                              </button>
                            </div>
                          ) : (
                            <div className={styles.buttonContainer}>
                              <button className={styles.iconButton} onClick={() => handleClick(transaction.id, 'APPROVED')}>
                                <CheckCircle className={styles.icon} />
                                Approve
                              </button>
                              <button className={styles.iconButton} onClick={() => handleClick(transaction.id, 'REJECTED')}>
                                <SlashCircle className={styles.icon} />
                                Reject
                              </button>
                              <button className={styles.iconButton} onClick={() => handleShowModal(transaction)}>
                                <Eye className={styles.icon} />
                                Detail
                              </button>
                            </div>
                          )
                        }
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTransaction && (
              <div className={styles.modalContent}>
                <div className={styles.modalHeaderCard}>
                  <p>From Account No.: <strong>{selectedTransaction.corporateId}</strong></p>
                  <p>Submit Date and Time: <strong>{moment(selectedTransaction.createdAt).format('DD MMM, YYYY HH:mm:ss')}</strong></p>
                  <p>Transfer Date: <strong>{moment(selectedTransaction.transferAt).format('DD MMM, YYYY')}</strong></p>
                  <p>Instruction Type: <strong>{selectedTransaction.instruction}</strong></p>
                  <p>Maker: <strong>{selectedTransaction.issuer?.name}</strong></p>
                  <p>Reference No.: <strong>{selectedTransaction.referenceId}</strong></p>
                  <p>Transfer Type: <strong>{selectedTransaction.type}</strong></p>
                </div>
                <div className={styles.modalSeparator}>
                  <p><strong>Total Transfer Record:</strong> {selectedTransaction.TransactionList?.length}</p>
                  <p><strong>Total Amount:</strong> Rp {numberFormat(Number(selectedTransaction.totalAmount))}</p>
                  <p><strong>Estimated Service Fee:</strong> Rp 0</p>
                </div>
                <div className={styles.modalTableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>To Account No.</th>
                        <th>To Account Name</th>
                        <th>To Account Bank</th>
                        <th>Transfer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTransaction.TransactionList?.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.userDestinationId}</td>
                          <td>{item.userDestination.name}</td>
                          <td>{item.corporateDestination.name}</td>
                          <td>{numberFormat(Number(item.amount))}</td>
                          <td>{selectedTransaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Overview;
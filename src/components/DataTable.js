import axios from 'axios';
import React from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import moment from 'moment';


const DataTable = () => {
    const [applications, setApplications] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const response = await axios.get(`http://localhost:9090/getallapplications`)
            setApplications(response.data);
        }
        fetchData();
    }, [])


    const addChecked = (id) => {
        if (!selectedIds.includes(id)) {
            setSelectedIds(selectedIds.concat(id));
        }
        else {
            setSelectedIds(selectedIds.filter(selectedIds => selectedIds !== id));
        }
    }

    const selectAll = () => {

    }

    const editBox = () => {
        return (
            <div style={{border: "1px solid #ddd"}}>
                <Button variant="danger" onClick={() => deleteLine(selectedIds)}>Delete</Button>
            </div>
        )
    }

    const deleteLine = (id) => {
        axios.delete(`http://localhost:9090/deleteapplication/${id}`)
        .then(res => {
            console.log(res);
        })
        setApplications(applications.filter(applications => applications.id !== id));
    }

    const renderTable = () => {
        return (
                applications.map(
                    application => 
                    <tr key={application.id}>
                        <td>
                            <input type="checkbox" onChange={() => addChecked(application.id)} />
                        </td>
                        <td>
                            {application.appdate != null ? moment(application.appdate).format("MM/DD/YYYY") : ""}
                        </td>
                        <td>
                            {application.title}
                        </td>
                        <td>
                            <a href={application.url.startsWith('https://') ||  application.url.startsWith('http://') ? application.url : "https://" + application.url}>
                                {application.url}
                            </a>
                        </td>
                        <td>
                            {(() => {
                                switch(application.status) {
                                    case 'Applied':
                                        return <Alert variant="primary">{application.status}</Alert>;
                                    case 'Interviewing':
                                        return <Alert variant="secondary">{application.status}</Alert>;
                                    case 'Offer':
                                        return <Alert variant="success">{application.status}</Alert>;
                                    case 'Rejected':
                                        return <Alert variant="danger">{application.status}</Alert>;
                                    case 'No Response':
                                        return <Alert variant="light">{application.status}</Alert>;
                                    case 'Offer Accepted':
                                        return <Alert variant="info">{application.status}</Alert>;
                                    case 'Offer Rejected':
                                        return <Alert variant="light">{application.status}</Alert>;
                                }
                            })()}
                        </td>
                    </tr>
                )
        )
    }

    return (
        <div style={{background: "white", padding: "50px"}}>
            <h5 style={{paddingBottom: "20px"}}>Job Applications</h5>
            <div>{selectedIds != "" ? editBox() : ""}</div>
            <Table hover style={{border: "1px solid #ddd"}}>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" />
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            Title
                        </th>
                        <th>
                            Url
                        </th>
                        <th style={{textAlign: "center"}}>
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {renderTable()}
                </tbody>
            </Table>
        </div>
    );
}
 
export default DataTable;
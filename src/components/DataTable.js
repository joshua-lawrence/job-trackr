import axios from 'axios';
import React from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';


const DataTable = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const response = await axios.get(`http://localhost:9090/getallapplications`)
            setApplications(response.data);
        }
        fetchData();
    }, [])

    const deleteLine = (id) => {
        if(window.confirm("Are you sure you wish to delete this job application?")) {
            axios.delete(`http://localhost:9090/delete/${id}`)
            .then(res => {
                console.log(res);
                setApplications(applications.filter(item => item.id !== id));
            })
        }
    }

    const renderTable = () => {
        return (
                applications.map(
                    application => 
                    <tr key={application.id}>
                        <td>
                            <input type="checkbox" />
                        </td>
                        <td>
                            {application.title}
                        </td>
                        <td>
                            <a href={application.url}>
                                {application.url}
                            </a>
                        </td>
                        <td>
                            {application.status}
                        </td>
                    </tr>
                )
        )
    }

    return (
        <Table hover>
            <thead>
                <tr>
                    <th></th>
                    <th>
                        Title
                    </th>
                    <th>
                        Url
                    </th>
                    <th>
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {renderTable()}
            </tbody>
        </Table>
    );
}
 
export default DataTable;
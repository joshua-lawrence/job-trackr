import axios from 'axios';
import React from 'react';
import Chart from "react-google-charts";
import { Form, FormControl, Table, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ApplicationManager = () => {
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("Applied");
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState("");
    const [applications, setApplications] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [editId, setEditId] = useState();
    const [editStatus, setEditStatus] = useState();

    useEffect(() => {
        const fetchData = async () => {
        const response = await axios.get(`https://warm-journey-64744.herokuapp.com/getallapplications`)
            setApplications(response.data);
            setLoading(false);
        }
        fetchData();
    }, [])

    const handleSubmit = (e) => {
        var url_regex = /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/;

        e.preventDefault();
        if (url == "" || !url.match(url_regex)) {
            setError("You must enter a valid URL.")
        }
        else if (title == "") {
            setError("You must enter a job title.");
        }
        else {
            setError("");
            const sendData = async () => {
                await axios.post('https://warm-journey-64744.herokuapp.com/addapplication', {
                    appdate: moment(date).format('YYYY-MM-DD'),
                    title: title,
                    url: url,
                    status: status
                })
                .then(function (response) {
                    setApplications(applications.concat(response.data));
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            sendData();
        }
    }

    const editApplication = (e) => {
        setEditId(e);
    }

    const saveStatusEdit = (e, application) => {
        if(application.status == e) {
            setEditId();
        }
        setEditStatus(e);
        axios.put(`https://warm-journey-64744.herokuapp.com/updateapplication`, {
            id: application.id,
            appdate: moment(application.date).format('YYYY-MM-DD'),
            title: application.title,
            url: application.url,
            status: e
        })
        .then(res => {
            var newApplications = applications;
            newApplications = newApplications.filter(newApplications => newApplications.id != application.id);
            setEditId();
            setApplications(newApplications.concat(res.data));
            console.log(res);
        })
    }

    const addChecked = (id) => {
        if (!selectedIds.includes(id)) {
            setSelectedIds(selectedIds.concat(id));
        }
        else {
            setSelectedIds(selectedIds.filter(selectedIds => selectedIds != id));
        }
    }

    const deleteLines = (id) => {
        var newIds = selectedIds;
        var newApplications = applications;
        id.map((item) => {
            axios.delete(`https://warm-journey-64744.herokuapp.com/${item}`)
            .then(res => {
                console.log(res);
            })
            newIds = newIds.filter(newIds => newIds != item);
            newApplications = newApplications.filter(newApplications => newApplications.id != item);
        })
        setSelectedIds(newIds);
        setApplications(newApplications);
    }

    const renderStatusDropdown = (application) => {
        return (
            <Form.Control id={application.id} as="select" value={application.status} onChange={(event) => saveStatusEdit(event.target.value, application)}> 
                <option>
                    Applied
                </option>
                <option>
                    Interviewing
                </option>
                <option>
                    Offer
                </option>
                <option>
                    Rejected
                </option>
                <option>
                    No Response
                </option>
                <option>
                    Offer Accepted
                </option>
                <option>
                    Offer Rejected
                </option>
            </Form.Control>
        )
    }

    const renderTable = () => {
        return (
                applications.sort((a,b) => new Date(b.appdate) - new Date(a.appdate)).map(
                    application => 
                    <tr key={application.id}>
                        <td>
                            <input type="checkbox" className="selectCheck" onChange={() => addChecked(application.id)} />
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
                                if (editId == application.id) {
                                   return renderStatusDropdown(application);
                                }
                                else {
                                    switch(application.status) {
                                        case 'Applied':
                                            return <Alert variant="primary" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                        case 'Interviewing':
                                            return <Alert variant="secondary" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                        case 'Offer':
                                            return <Alert variant="success" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                        case 'Rejected':
                                            return <Alert variant="danger" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                        case 'No Response':
                                            return <Alert variant="light" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                        case 'Offer Accepted':
                                            return <Alert variant="info" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                        case 'Offer Rejected':
                                            return <Alert variant="light" onClick={() => editApplication(application.id)}>{application.status}</Alert>;
                                    }
                                }
                            })()}
                        </td>
                    </tr>
                )
        )
    }
    
    var applied = applications.length;
    var offer = applications.filter((applications => applications.status == "Offer")).length;
    var rejected = applications.filter((applications => applications.status == "Rejected")).length;
    var offeraccepted = applications.filter((applications => applications.status == "Offer Accepted")).length;
    var offerrejected = applications.filter((applications => applications.status == "Offer Rejected")).length;
    var interviewing = applications.filter((applications => applications.status == "Interviewing")).length;
    var noresponse = applications.filter((applications => applications.status == "No Response")).length + applications.filter((applications => applications.status == "Applied")).length;

    

    return (
        <>
        <Chart
            width={"100%"}
            height={350}
            style={{marginTop: "50px"}}
            chartType="Sankey"
            loader={<Spinner animation="border"/>}
            data={[
              ['From', 'To', 'Count'],
              ['Applied', 'Interviewing', interviewing],
              ['Applied', 'No Response', noresponse],
              ['Interviewing', 'Offer', offer],
              ['Interviewing', 'Rejected', rejected],
              ['Offer', 'Offer Accepted', offeraccepted],
              ['Offer', 'Offer Rejected', offerrejected]

            ]}
        />
        {loading ? <span>Heroku takes forever to spin up... <Spinner animation="border"/></span> : ""}
        <Form onSubmit = { handleSubmit } style={{backgroundColor: "white", padding: "50px", marginBottom: "100px", marginTop: "100px"}}>
            <h5 style={{paddingBottom: "20px"}}>Add a New Job Application</h5>
            {error != "" ? <Alert variant="danger">{error}</Alert> : ""}
            <Form.Row>
                <Col>
                    <DatePicker className="form-control" selected={date} placeholderText="Date" onChange={date => setDate(date)} />
                </Col>
                <Col>
                    <Form.Control type="text" name="title" placeholder="Job Title" onChange={(event) => setTitle(event.target.value)} />
                </Col>
                <Col>
                    <Form.Control type="text" name="url" placeholder="Url" onChange={(event) => setUrl(event.target.value)} />
                </Col>
                <Col>
                    <Form.Control as="select" name="status" onChange={(event) => setStatus(event.target.value)} > 
                        <option>
                            Applied
                        </option>
                        <option>
                            Interviewing
                        </option>
                        <option>
                            Offer
                        </option>
                        <option>
                            Rejected
                        </option>
                        <option>
                            No Response
                        </option>
                        <option>
                            Offer Accepted
                        </option>
                        <option>
                            Offer Rejected
                        </option>
                    </Form.Control>
                </Col>
                <Col>
                    <Button type="submit">Add</Button>
                </Col>
            </Form.Row>
        </Form>
        <Row style={{background: "white", padding: "50px", marginBottom: "100px"}}>
            <Col>
                <h5 style={{paddingBottom: "20px"}}>Job Applications</h5>
                <div style={{float: "right", paddingBottom: "10px"}}>
                    <Button variant="danger" disabled={selectedIds == "" ? "disabled" : ""} onClick={() => deleteLines(selectedIds)}>Delete</Button>
                </div>
                <Table hover style={{border: "1px solid #ddd"}}>
                    <thead>
                        <tr>
                            <th>
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
            </Col>
        </Row>
        </>
    );
}
 
export default ApplicationManager;
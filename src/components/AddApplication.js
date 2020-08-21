import React from 'react';
import { useState } from 'react';
import { Form, FormControl, Col, Button, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

const AddApplication = () => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("Applied");
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState("");

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
                await axios.post('http://localhost:9090/addapplication', {
                    appdate: moment(date).format('YYYY-MM-DD'),
                    title: title,
                    url: url,
                    status: status
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            sendData();
        }
    }


    return (  
        <>
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
                        <Form.Control as="select" name="status" onChange={(event) => setStatus(event.target.value)}> 
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
        </>
    );
}
 
export default AddApplication;
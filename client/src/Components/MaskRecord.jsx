import React from 'react';
// import '../App.css';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
class MaskRecord extends React.Component {
    state = {
        maskID: '',
        records: ''
    };
    async getMaskRecord() {
        console.log("Mask id", this.state.maskID);
        const { maskID, records } = this.state;

        const maskRecord = {
            maskID,
            records
        };
        console.log("Mask record", maskRecord);

        let response = await axios.post('/getMaskRecords', maskRecord);
        console.log(response.data);
        this.setState({ records: response.data });

        console.log("These are records", this.state.records);

        //   .then(() => console.log('Book Created'))
        //   .catch(err => {
        //     console.error(err);
        //   });

    }
    handleChange(evt) {
        this.setState({
            ...this.state,
            [evt.target.name]: evt.target.value
        }
        );

    }

    render() {
        return <div className="App">
            <header className="App-header">
                <Form>
                    <Row form>
                        <Col md={20}>
                            <FormGroup>
                                <Label for="maskId">Mask ID</Label>
                                <Input type="text" name="maskID" id="maskID" placeholder="with a placeholder" onChange={evt => this.handleChange(evt)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button onClick={() => this.getMaskRecord()}>Submit</Button>
                </Form>
            </header>

        </div>
    }
}

export default MaskRecord;
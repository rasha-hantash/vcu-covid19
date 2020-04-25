import React from 'react';
// import '../App.css';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
class UpdateMask extends React.Component {
    updateMask() { }

    render() {
        return <div className="App">
            <header className="App-header">
                <Form>
                    <Row form>
                        <Col md={20}>
                            <FormGroup>
                                <Label for="maskId">Mask ID</Label>
                                <Input type="text" name="maskid" id="maskID" placeholder="with a placeholder" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button onClick={this.updateMask()}>Submit</Button>
                </Form>
            </header>

        </div>
    }
}

export default UpdateMask;
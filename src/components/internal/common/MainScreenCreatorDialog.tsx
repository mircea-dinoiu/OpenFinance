import * as React from 'react';
import {parseCRUDError} from 'parsers';

import {ErrorSnackbar, SuccessSnackbar} from 'components/snackbars';
import {ButtonProgress} from 'components/loaders';

import {Col, Row} from 'react-grid-system';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {dialog} from 'defs/styles';
import {useUsers} from 'state/hooks';
import {
    TypeTransactionForm,
} from 'types';

type TypeProps = {
    getFormDefaults: ({
        user: TypeUsers,
    }) => TypeTransactionForm,
    formToModel: Function,
    entityName: string,
    onReceiveNewRecord: Function,
    formComponent: React.ComponentType<{
        initialValues: TypeTransactionForm;
        onFormChange: (TypeTransactionForm) => void;
    }>,
    onRequestCreate: Function,
    onCancel: () => void,
    classes: {},
    open: boolean,
};

const MainScreenCreatorDialog = (props: TypeProps) => {
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<React.ReactNode>(null);
    const [success, setSuccess] = React.useState<React.ReactNode>(null);
    const user = useUsers();
    const formDefaults = React.useMemo(
        () =>
            props.getFormDefaults({
                user,
            }),
        [],
    );
    const [formData, setFormData] = React.useState(
        props.getFormDefaults({
            user,
        }),
    );

    const save = async () => {
        const data = formData;

        setError(null);
        setSuccess(null);
        setSaving(true);

        try {
            const response = await props.onRequestCreate([
                props.formToModel(data, {
                    user,
                }),
            ]);
            const json = response.data;

            setSuccess(`The ${props.entityName} was successfully created`);
            setSaving(false);

            props.onReceiveNewRecord(json[0]);
        } catch (e) {
            if (e.response) {
                setError(parseCRUDError(e.response.data));
                setSaving(false);
            } else {
                setError(e.message);
                setSaving(false);
            }
        }
    };

    const Form = props.formComponent;

    return (
        <Dialog open={props.open} classes={props.classes} fullWidth={true}>
            <DialogTitle>{`Create ${props.entityName}`}</DialogTitle>
            <DialogContent style={{overflow: 'visible'}}>
                <Row>
                    <Form
                        onFormChange={(nextFormData) =>
                            setFormData(nextFormData)
                        }
                        initialValues={formDefaults}
                    />
                </Row>
                <Col>
                    {error && <ErrorSnackbar message={error} />}
                    {success && <SuccessSnackbar message={success} />}
                </Col>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    disabled={saving}
                    onClick={props.onCancel}
                                        style={{marginRight: 5}}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={saving}
                    color="primary"
                    onClick={save}
                                        style={{float: 'right'}}
                >
                    {saving ? <ButtonProgress /> : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(dialog)(MainScreenCreatorDialog);

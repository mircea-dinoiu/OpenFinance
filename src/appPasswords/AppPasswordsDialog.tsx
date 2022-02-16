import {DialogTitleWithClose} from '../app/DialogTitleWithClose';
import React, {useState} from 'react';
import {Dialog, DialogContent, Button} from '@material-ui/core';
import {createXHR} from '../app/fetch';
import {makeUrl} from '../app/url';
import {Api} from '../app/Api';

export const AppPasswordsDialog = ({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) => {
    const [values, setValues] = useState<{password: string; name: string}>({password: '', name: ''});
    const [appPassword, setAppPassword] = useState('');

    const createAppPassword = async () => {
        const r = await createXHR<string>({
            url: Api.user.appPasswordCreate,
            method: 'POST',
            data: values,
        });

        setAppPassword(r.data);
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitleWithClose title="App Passwords" onClose={onClose} />
            <DialogContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createAppPassword();
                    }}
                >
                    <div>
                        <label>
                            Current Password:
                            <input
                                type="password"
                                value={values.password}
                                onChange={(e) => setValues((v) => ({...v, password: e.target.value}))}
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={values.name}
                                onChange={(e) => setValues((v) => ({...v, name: e.target.value}))}
                            />
                        </label>
                    </div>

                    <Button type="submit" variant="outlined">
                        Create App Password
                    </Button>
                </form>

                <hr />

                <label>
                    App Password:
                    <input type="text" readOnly={true} value={appPassword} />
                </label>
            </DialogContent>
        </Dialog>
    );
};

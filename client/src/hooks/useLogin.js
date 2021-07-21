import React, { useCallback, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from 'src/context/UserContext';
const validUsers = ['alice', 'jelly', 'bob'];
const frontEndValidate = (formData) => {
    // hack our login user only to be 3 names
    // [jelly, alice, bob]
    var name = formData.name || '';
    if (validUsers.indexOf(name.toLowerCase()) < 0) {
        return false;
    }
    if (!formData.pw || formData.pw !== '123123') {
        return false;
    }
    return true;
};
const useLogin = () => {
    const history = useHistory();
    const userContext = useContext(UserContext);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ pw: '', name: '' });
    const onInputChangeHandler = (e) => {
        const key = e.target.name;
        setForm(form => {
            let updatedForm = { ...form };
            updatedForm[key] = e.target.value;
            return updatedForm;
        });
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log("submit clicked!");
        if (!frontEndValidate(form)) {
            console.log("error login:", form);
            setError("Error username or password !");
            return;
        }
        // simple nodejs api call
        let queryName = form.name || '';
        queryName.toLowerCase();
        fetch(`http://localhost:8000/auth/${queryName}`)
            .then(resp => resp.json())
            .then(data => {
                var myId = data.id;
                var myName = data.name;
                userContext.setMyId(myId);
                userContext.setName(myName);
                history.push("/chat");
            })

    }

    return { form, error, onInputChangeHandler, onSubmitHandler };
}

export default useLogin;

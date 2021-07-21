import React from 'react';
import "./Login.css";
import useLogin from 'src/hooks/useLogin';

const Login = () => {
    const { form, error, onInputChangeHandler, onSubmitHandler } = useLogin();
    return (
        <div className="login-container">
            <div className="reminder">
                <h3>Valid Credentials:</h3>
                <p>alice 123123</p>
                <p>jelly 123123</p>
                <p>bob 123123</p>
            </div>
            <div>
                <div className="login">
                    <h1>Login</h1>
                    <label htmlFor="name" >Name</label>
                    <input id="name" name="name" value={form.name} onChange={onInputChangeHandler} />
                    <label htmlFor="pw" >Password</label>
                    <input id="pw" name="pw" value={form.pw} type="password" onChange={onInputChangeHandler} />
                    <button onClick={onSubmitHandler}> Submit</button>
                </div>
                {
                    error && (<div className="error-text">{error}</div>)
                }
            </div>
        </div>
    )
}

export default Login;

"use client"
import React, { useState } from 'react';
import { setCookie } from 'cookies-next';
import Service from "../api/Service";
import logo from '../favicon.ico';
import Image from 'next/image'
import styles from '../page.module.css'
import Swal from 'sweetalert2';

export default function Home() {
  const [UserName, setUserName] = useState('');
  const [UserPass, setUserPass] = useState('');
  const [NewPass, setNewPass] = useState('');
  const [ConfirmPass, setConfirmPass] = useState('');
  const [Message, setMessage] = useState('');
  const [MessageL, setMessageL] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [display1, setDisplay1] = useState('block');
  const [display2, setDisplay2] = useState('none');

  const inputNewPass = (event) => {
    setNewPass(event.target.value);
  }
  const inputConfirmPass = (event) => {
    setConfirmPass(event.target.value);
  }
  const CheckPassword = (event) => {

    if (ConfirmPass != NewPass) {
      setMessage("Password don't match.");
    } else {
      setMessage('');
    }

    checkDisabled();

  }
  const CheckLength = (event) => {

    if (NewPass.length < 8) {
      setMessageL("Password 8-12 characters.");
    } else {
      setMessageL('');

    }

    checkDisabled();

  }

  const checkDisabled = () => {

    if (NewPass.length < 8 || ConfirmPass != NewPass) {
      setDisabled(true);
    } else {
      setDisabled(false);

    }

  }


  const submitPassword = (event) => {
    let Username = UserName;
    let Password = NewPass;
    if (Password) {
      console.log(Username);
      new Service().resetPassword(Username, Password).then(res => {
        //console.log(JSON.stringify(res.data));
        if (res.data.status === '1') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Reset Password Successfully.',
            showConfirmButton: true,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              setCookie('token', data.token, {
                path: '/',
                maxAge: 4 * 60 * 60,
              }); window.location.href = '/Tierlist';

            }
          })
        }
      });
    }
  }

  const inputUser = (event) => {
    setUserName(event.target.value);
  }
  const inputPass = (event) => {
    setUserPass(event.target.value);
  }

  const submitLogin = async (event) => {
    if (!UserName || !UserPass) {
      Swal.fire("Please enter both username and password.", "", "error");
      return;
    }

    try {
      const data = await new Service().gettoken(UserName, UserPass);

      console.log("Parsed response data:", data);

      if (data && data.success && data.token) {
        setCookie("token", data.token, {
          path: "/",
          maxAge: 24 * 60 * 60,
        });
        window.location.href = "/admin/Tierlist/Character";
      } else {
        Swal.fire("Login failed. Please check your credentials.", "", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("An error occurred. Please try again later.", "", "error");
    }
  };



  const PopupForgetPass = () => {

    Swal.fire(
      'Please contract administrator: Call 092-8741997',
      'กรุณาติดต่อเจ้าหน้าที่ โทร : 092-8741997',
      'warning'
    )


  }
  return (
    <div className={styles.container}>

      <div className={styles.main}>
        <div className="row">
          <div className="col-12">
            <div className="login-card">
              <div className="col-11">
                <div className="text-center mb-3">
                  <a >
                    <Image src={logo} alt="looginpage" width={100} />
                  </a>
                </div>
                <div className="login-main col-12" style={{ display: display1, fontSize: '16px' }}>
                  <h4>Sign in to account</h4>
                  <p>Enter your Staff id & password to login<br />ระบุ รหัสพนักงาน และ รหัสผ่าน เพื่อเข้าสู่ระบบ</p>
                  <div className="form-group">
                    <label className="col-form-label">Staff id / รหัสGG</label>
                    <input
                      className="form-control"
                      type="text"
                      required=""
                      placeholder="Staff id"
                      onChange={inputUser}
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Password / รหัสผ่าน</label>
                    <input className="form-control" type="password" name="UserPassword" required="" placeholder="*********" onChange={inputPass} style={{ fontSize: '16px' }}
                    />
                    <label className="col-form-label text-danger" onClick={PopupForgetPass}><small></small>Forget Password / ลืมรหัสผ่าน</label>
                  </div>
                  <div className="form-group mb-0 mt-4 text-center">
                    <button className="btn btn-sm"
                      style={{ width: '335px', backgroundColor: '#95191F', borderColor: '#95191F' }}
                      type="button"
                      onClick={submitLogin}>
                      <b>Sign in</b>
                    </button>                  </div>
                </div>

                <div className="login-main col-12" style={{ display: display2 }} >
                  <h4>Reset Your Password</h4>
                  <div className="form-group">
                    <label className="col-form-label">New Password</label>
                    <input className="form-control" type="password" min={8} onChange={inputNewPass} onBlur={CheckLength} />
                    <label className="text-danger f-12 mt-1">{MessageL}</label>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Confirm Password</label>
                    <input className="form-control" type="password" min={8} onChange={inputConfirmPass} onBlur={CheckPassword} />
                    <label className="text-danger f-12 mt-1">{Message}</label>
                  </div>
                  <div className="form-group mb-0 mt-4 text-center">
                    <button className="btn btn-sm btn-primary" type="button" disabled={disabled} onClick={submitPassword}>Save Password</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

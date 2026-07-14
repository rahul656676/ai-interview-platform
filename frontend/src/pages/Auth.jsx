import {useState} from "react";

import axios from "axios";

export default function Auth(){

  const [isLogin,setIsLogin] =
    useState(false);

  const [form,setForm] = useState({

    name:"",
    email:"",
    password:""

  });

  const submit = async()=>{

    try{

      const url = isLogin

      ? import.meta.env.VITE_API_URL + "/api/auth/login"

      : import.meta.env.VITE_API_URL + "/api/auth/register";

      const res = await axios.post(
        url,
        form
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      window.location.href = "/";

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message
        || "Error"
      );

    }

  };

  return(

    <div style={{

      background:"#0f1117",
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"

    }}>

      <div style={{

        width:"400px",
        background:"#161b27",
        padding:"30px",
        borderRadius:"20px"

      }}>

        <h1 style={{
          color:"white",
          marginBottom:"20px"
        }}>
          {
            isLogin
            ? "Login"
            : "Register"
          }
        </h1>

        {

          !isLogin && (

            <input

              placeholder="Name"

              style={inputStyle}

              onChange={(e)=>

                setForm({

                  ...form,
                  name:e.target.value

                })

              }

            />

          )

        }

        <input

          placeholder="Email"

          style={inputStyle}

          onChange={(e)=>

            setForm({

              ...form,
              email:e.target.value

            })

          }

        />

        <input

          type="password"

          placeholder="Password"

          style={inputStyle}

          onChange={(e)=>

            setForm({

              ...form,
              password:e.target.value

            })

          }

        />

        <button

          onClick={submit}

          style={buttonStyle}

        >

          {
            isLogin
            ? "Login"
            : "Register"
          }

        </button>

        <p

          style={{
            color:"white",
            marginTop:"20px",
            cursor:"pointer"
          }}

          onClick={()=>
            setIsLogin(!isLogin)
          }

        >

          {

            isLogin

            ? "Create Account"

            : "Already have account?"

          }

        </p>

      </div>

    </div>

  );

}

const inputStyle = {

  width:"100%",

  padding:"14px",

  marginBottom:"15px",

  borderRadius:"10px",

  border:"none",

  background:"#222b3c",

  color:"white"

};

const buttonStyle = {

  width:"100%",

  padding:"14px",

  borderRadius:"10px",

  border:"none",

  background:"#00e0b8",

  fontWeight:"bold",

  cursor:"pointer"

};
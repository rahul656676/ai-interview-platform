export default function Dashboard(){

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = ()=>{

    localStorage.clear();

    location.reload();

  };

  return(

    <div style={{

      minHeight:"100vh",

      background:
      "linear-gradient(135deg,#020617,#071224,#0f172a)",

      color:"white",

      padding:"40px",

      fontFamily:"Arial"

    }}>

      {/* HEADER */}

      <div style={{

        display:"flex",

        justifyContent:"space-between",

        alignItems:"center",

        marginBottom:"50px"

      }}>

        <div>

          <h1 style={{

            fontSize:"44px",

            color:"#60a5fa",

            marginBottom:"10px"

          }}>

            AI Interview Platform

          </h1>

          <p style={{

            color:"#94a3b8",

            fontSize:"18px"

          }}>

            Welcome back, {user?.name}
          </p>

        </div>

        <button

          onClick={logout}

          style={logoutButton}

        >

          Logout

        </button>

      </div>

      {/* STATS */}

      <div style={{

        display:"grid",

        gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",

        gap:"25px"

      }}>

        <StatCard
          title="ATS Score"
          value="92%"
        />

        <StatCard
          title="Interviews"
          value="14"
        />

        <StatCard
          title="Confidence"
          value="8.8/10"
        />

        <StatCard
          title="Weak Area"
          value="System Design"
        />

      </div>

      {/* MAIN SECTION */}

      <div style={mainCard}>

        <h2 style={sectionTitle}>
          AI Career Tools
        </h2>

        <p style={{

          color:"#94a3b8",

          marginTop:"10px",

          fontSize:"17px"

        }}>

          Resume ATS Analyzer + AI Voice Interview

        </p>

        <div style={{

          display:"flex",

          gap:"20px",

          marginTop:"30px",

          flexWrap:"wrap"

        }}>

          {/* RESUME */}

          <button

            onClick={()=>{
              location.href="/resume";
            }}

            style={mainButton}

          >

            Resume ATS Analyzer

          </button>

          {/* VOICE */}

          <button

            onClick={()=>{
              location.href="/voice";
            }}

            style={mainButton}

          >

            Start AI Interview

          </button>

        </div>

      </div>

    </div>

  );

}

// STAT CARD

function StatCard({title,value}){

  return(

    <div style={statCard}>

      <p style={{

        color:"#94a3b8",

        fontSize:"16px"

      }}>

        {title}

      </p>

      <h1 style={{

        color:"#60a5fa",

        marginTop:"15px",

        fontSize:"34px"

      }}>

        {value}

      </h1>

    </div>

  );

}

// STYLES

const statCard = {

  background:
  "rgba(15,23,42,0.9)",

  border:
  "1px solid #1d4ed8",

  borderRadius:"24px",

  padding:"30px",

  boxShadow:
  "0 0 30px rgba(37,99,235,0.15)"

};

const mainCard = {

  marginTop:"45px",

  background:
  "rgba(15,23,42,0.95)",

  border:
  "1px solid #2563eb",

  borderRadius:"28px",

  padding:"40px",

  boxShadow:
  "0 0 40px rgba(37,99,235,0.2)"

};

const sectionTitle = {

  color:"#60a5fa",

  fontSize:"32px"

};

const mainButton = {

  padding:"16px 28px",

  border:"none",

  borderRadius:"16px",

  background:
  "linear-gradient(90deg,#2563eb,#3b82f6)",

  color:"white",

  fontSize:"16px",

  fontWeight:"bold",

  cursor:"pointer",

  boxShadow:
  "0 0 20px rgba(37,99,235,0.3)"

};

const logoutButton = {

  padding:"14px 24px",

  border:"none",

  borderRadius:"14px",

  background:
  "linear-gradient(90deg,#2563eb,#3b82f6)",

  color:"white",

  fontWeight:"bold",

  cursor:"pointer"

};
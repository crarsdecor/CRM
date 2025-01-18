import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Typography } from 'antd';


import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaExclamationCircle,
  FaRegCalendarAlt,
  FaClock
} from "react-icons/fa";
import moment from 'moment';




const apiUrl = process.env.REACT_APP_BACKEND_URL;
const { Title } = Typography;


const Stage1 = () => {
  const [userData, setUserData] = useState(null); // null to handle loading state
  console.log(userData);
  const user = JSON.parse(localStorage.getItem("user"));


  const formatDate = (date) => {
    if (!date) return "N/A";
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };


  async function fetchUserData() {
    try {
      const response = await axios.get(`${apiUrl}/api/users/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }


  useEffect(() => {
    fetchUserData();
  }, []);


  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }
  const getIcon = (status) => {
    switch (status) {
      case 'Done':
        return <FaCheckCircle style={{ color: 'green' }} />;
      case 'Pending':
      case undefined:
        return <FaClock style={{ color: 'blue' }} />;
      default:
        return <FaExclamationCircle style={{ color: 'red' }} />;
    }
  };


  const getContentStyle = (status) => {
    switch (status) {
      case 'Done':
        return {
          background: '#c8e6c9', // Light green background for Done tasks
          borderRadius: '8px',
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          border: '1px solid #ddd'
        };
      case 'Pending':
      case undefined:
        return {
          background: '#bbdefb', // Light blue background for Pending tasks
          borderRadius: '8px',
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          border: '1px solid #ddd'
        };
      default:
        return {
          background: '#ffcdd2', // Light red background for Error tasks
          borderRadius: '8px',
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          border: '1px solid #ddd'
        };
    }
  };
 
 


  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        User Information Timeline
      </h1>
      <VerticalTimeline>
      <VerticalTimelineElement
         date={`Payment Status: ${userData?.stage1?.status || 'Pending'}`}
         icon={getIcon(userData?.stage1?.status)}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.stage1?.status)}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Payment Stage 1</Title>
         <p><strong>Amount:</strong> {userData?.stage1?.amount || 'N/A'}</p>
         <p><strong>Payment Mode:</strong> {userData?.stage1?.paymentMode || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.stage1?.date ? moment(userData?.stage1?.date).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>


 
      {/* Legality Card */}
<VerticalTimelineElement
 date={`Legality Status: ${userData?.legality || 'Pending'}`}
 icon={getIcon(userData?.legality)}
 iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
 contentStyle={getContentStyle(userData?.legality)}
 contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
 dateStyle={{ color: '#999', fontSize: '14px' }}
>
 <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Legality</Title>
 <p><strong>Legality:</strong> {userData?.legality || 'Pending'}</p>
  {/* Legality Link with full URL check */}
 <p><strong>Legality Link:</strong>
   {userData?.legalityLink ? (
     <a
       href={userData?.legalityLink.startsWith('http') ? userData?.legalityLink : `http://${userData?.legalityLink}`}
       target="_blank"
       rel="noopener noreferrer"
     >
       View Document
     </a>
   ) : 'N/A'}
 </p>
  <p><strong>Date:</strong> {userData?.legalityDate ? moment(userData?.legalityDate).format('DD-MM-YYYY') : 'N/A'}</p>
</VerticalTimelineElement>








       {/* Onboarding Video Call (OVC) Card */}
       <VerticalTimelineElement
         date={`OVC Status: ${userData?.ovc || 'Pending'}`}
         icon={getIcon(userData?.ovc)}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.ovc)}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Onboarding Video Call (OVC)</Title>
         <p><strong>OVC:</strong> {userData?.ovc || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.ovcDate ? moment(userData?.ovcDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* ID Card Card */}
       <VerticalTimelineElement
         date={`ID Card Status: ${userData?.idCard || 'Pending'}`}
         icon={getIcon(userData?.idCard)}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.idCard)}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>ID Card</Title>
         <p><strong>ID Card:</strong> {userData?.idCard || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.idCardDate ? moment(userData?.idCardDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Theme Card */}
       <VerticalTimelineElement
         date={`Theme Status: ${userData?.theme ? 'Done' : 'Pending'}`}
         icon={getIcon(userData?.theme ? 'Done' : 'Pending')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.theme ? 'Done' : 'Pending')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Theme</Title>
         <p><strong>Theme:</strong> {userData?.theme || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.themeDate ? moment(userData?.themeDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Stage 1 Completion Card */}
       <VerticalTimelineElement
         date={`Stage 1 Completion Status: ${userData?.stage1Completion || 'Pending'}`}
         icon={getIcon(userData?.stage1Completion)}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.stage1Completion)}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Stage 1 Completed</Title>
         <p><strong>Stage 1 Completion:</strong> {userData?.stage1Completion || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.stage1CompletionDate ? moment(userData?.stage1CompletionDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>


        {/* Add more timeline elements as needed */}
      </VerticalTimeline>
    </div>
  );
};


export default Stage1;






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


const Stage2 = () => {
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
      case 'Not Done':
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
      case 'Not Done':
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
       {/* Payment Stage 2 Card */}
       {userData && (
         <VerticalTimelineElement
           date={`Payment Stage 2 Status: ${userData?.stage2?.status || 'Pending'}`}
           icon={getIcon(userData?.stage2?.status || 'Pending')}
           iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
           contentStyle={getContentStyle(userData?.stage2?.status || 'Pending')}
           contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
           dateStyle={{ color: '#999', fontSize: '14px' }}
         >
           <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Payment Stage 2</Title>
           <p><strong>Amount:</strong> {userData?.stage2?.amount || 'Pending'}</p>
           <p><strong>Payment Mode:</strong> {userData?.stage2?.paymentMode || 'Pending'}</p>
           <p><strong>Status:</strong> {userData?.stage2?.status || 'Pending'}</p>
           <p><strong>Date:</strong> {userData?.stage2?.date ? moment(userData?.payment?.stage2?.date).format('DD-MM-YYYY') : 'N/A'}</p>
         </VerticalTimelineElement>
       )}




       {/* CAT File Card */}
       <VerticalTimelineElement
         date={`CAT File Status: ${userData?.catFile ? 'Done' : 'Not Done'}`}
         icon={getIcon(userData?.catFile ? 'Done' : 'Not Done')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.catFile ? 'Done' : 'Not Done')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>CAT File</Title>
         <p><strong>File:</strong> {userData?.catFile || 'Not Done'}</p>
         <p><strong>Date:</strong> {userData?.catDate ? moment(userData?.catDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Product File Card */}
       {/* <VerticalTimelineElement
         date={`Product File Status: ${userData?.productFile ? 'Available' : 'Not Available'}`}
         icon={getIcon(userData?.productFile ? 'Done' : 'Pending')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.productFile ? 'Done' : 'Pending')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Product File</Title>
         <p><strong>File:</strong> {userData?.productFile || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.productDate ? moment(userData?.productDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement> */}




       {/* Logo Card */}
       <VerticalTimelineElement
         date={`Logo Status: ${userData?.logo ? 'Available' : 'Not Available'}`}
         icon={getIcon(userData?.logo ? 'Done' : 'Pending')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.logo ? 'Done' : 'Pending')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Logo</Title>
         <p><strong>File:</strong> {userData?.logo || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.logoDate ? moment(userData?.logoDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Banner Card */}
       <VerticalTimelineElement
         date={`Banner Status: ${userData?.banner ? 'Available' : 'Not Available'}`}
         icon={getIcon(userData?.banner ? 'Done' : 'Pending')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.banner ? 'Done' : 'Pending')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Banner</Title>
         <p><strong>File:</strong> {userData?.banner || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.bannerDate ? moment(userData?.bannerDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Gallery Card */}
       <VerticalTimelineElement
         date={`Gallery Status: ${userData?.gallery ? 'Available' : 'Not Available'}`}
         icon={getIcon(userData?.gallery ? 'Done' : 'Pending')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.gallery ? 'Done' : 'Pending')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Gallery</Title>
         <p><strong>File:</strong> {userData?.gallery || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.galleryDate ? moment(userData?.galleryDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Stage 2 Completion Card */}
       <VerticalTimelineElement
         date={`Stage 2 Completion Status: ${userData?.stage2Completion || 'Pending'}`}
         icon={getIcon(userData?.stage2Completion || 'Pending')}
         iconStyle={{ background: 'white', color: '#fff', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}
         contentStyle={getContentStyle(userData?.stage2Completion || 'Pending')}
         contentArrowStyle={{ borderRight: '7px solid  #f9f9f9' }}
         dateStyle={{ color: '#999', fontSize: '14px' }}
       >
         <Title level={5} style={{ fontWeight: 'bold', color: '#333' }}>Stage 2 Completed</Title>
         <p><strong>Status:</strong> {userData?.stage2Completion || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.stage2CompletionDate ? moment(userData?.stage2CompletionDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>
     </VerticalTimeline>
    </div>
  );
};


export default Stage2;






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
       {/* Payment Stage 3 */}
       <VerticalTimelineElement
         date={`Payment Stage 3 Status: ${userData?.stage3?.status || 'Pending'}`}
         icon={getIcon(userData?.stage3?.status || 'Pending')}
         contentStyle={getContentStyle(userData?.stage3?.status || 'Pending')}
       >
         <Title level={5}>Payment Stage 3</Title>
         <p><strong>Amount:</strong> {userData?.stage3?.amount || 'N/A'}</p>
         <p><strong>Payment Mode:</strong> {userData?.stage3?.paymentMode || 'N/A'}</p>
         <p><strong>Status:</strong> {userData?.stage3?.status || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.stage3?.date ? moment(userData?.payment?.stage3?.date).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Server Purchase */}
       <VerticalTimelineElement
         date={`Server Purchase Date: ${userData?.serverPurchase || 'N/A'}`}
         icon={getIcon(userData?.serverPurchase ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.serverPurchase ? 'Done' : 'Pending')}
       >
         <Title level={5}>Server Purchase</Title>
         <p><strong>Server Purchase:</strong> {userData?.serverPurchase || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.serverPurchaseDate ? moment(userData?.serverPurchaseDate).format('DD-MM-YYYY') : 'N/A'}</p>
         <p><strong>Server ID:</strong> {userData?.serverId || 'N/A'}</p>
         <p><strong>Server Password:</strong> {userData?.serverPassword || 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Domain Claim */}
       <VerticalTimelineElement
         date={`Domain Claim Date: ${userData?.domainClaimDate || 'N/A'}`}
         icon={getIcon(userData?.domainClaim ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.domainClaim ? 'Done' : 'Pending')}
       >
         <Title level={5}>Domain Claim</Title>
         <p><strong>Domain Claim:</strong> {userData?.domainClaim || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.domainClaimDate ? moment(userData?.domainClaimDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Domain Mail Verification */}
       <VerticalTimelineElement
         date={`Domain Mail Verification Date: ${userData?.domainMailVerification || 'N/A'}`}
         icon={getIcon(userData?.domainMailVerification ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.domainMailVerification ? 'Done' : 'Pending')}
       >
         <Title level={5}>Domain Mail Verification</Title>
         <p><strong>Verification:</strong> {userData?.domainMailVerification || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.domainMailVerificationDate ? moment(userData?.domainMailVerificationDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Website Uploaded */}
       <VerticalTimelineElement
         date={`Website Uploaded Date: ${userData?.websiteUploaded || 'N/A'}`}
         icon={getIcon(userData?.websiteUploaded ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.websiteUploaded ? 'Done' : 'Pending')}
       >
         <Title level={5}>Website Uploaded</Title>
         <p><strong>Status:</strong> {userData?.websiteUploaded || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.websiteUploadedDate ? moment(userData?.websiteUploadedDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* ID and PASS */}
       <VerticalTimelineElement
         date={`ID and PASS Provided`}
         icon={getIcon(userData?.stage3?.websiteId || userData?.websiteId?.pass ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.websiteId?.id || userData?.websiteId?.pass ? 'Done' : 'Pending')}
       >
         <Title level={5}>ID and PASS</Title>
         <p><strong>ID:</strong> {userData?.stage3?.websiteId || 'N/A'}</p>
         <p><strong>Pass:</strong> {userData?.stage3?.websitePass || 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Payment Gateway */}
       {/* <VerticalTimelineElement
         date={`Payment Gateway Date: ${userData?.paymentGatewayDate || 'N/A'}`}
         icon={getIcon(userData?.paymentGateway ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.paymentGateway ? 'Done' : 'Pending')}
       >
         <Title level={5}>Payment Gateway</Title>
         <p><strong>Gateway:</strong> {userData?.paymentGateway || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.paymentGatewayDate ? moment(userData?.paymentGatewayDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement> */}




       {/* Ready to Handover */}
       <VerticalTimelineElement
         date={`Ready to Handover Date: ${userData?.readyToHandover || 'N/A'}`}
         icon={getIcon(userData?.readyToHandover ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.readyToHandover ? 'Done' : 'Pending')}
       >
         <Title level={5}>Ready to Handover</Title>
         <p><strong>Status:</strong> {userData?.readyToHandover || 'N/A'}</p>
         <p><strong>Date:</strong> {userData?.readyToHandoverDate ? moment(userData?.readyToHandoverDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>




       {/* Stage 3 Completion */}
       <VerticalTimelineElement
         date={`Stage 3 Completion Date: ${userData?.stage3Completion || 'N/A'}`}
         icon={getIcon(userData?.stage3Completion ? 'Done' : 'Pending')}
         contentStyle={getContentStyle(userData?.stage3Completion ? 'Done' : 'Pending')}
       >
         <Title level={5}>Stage 3 Completed</Title>
         <p><strong>Status:</strong> {userData?.stage3Completion || 'Pending'}</p>
         <p><strong>Date:</strong> {userData?.stage3CompletionDate ? moment(userData?.stage3CompletionDate).format('DD-MM-YYYY') : 'N/A'}</p>
       </VerticalTimelineElement>
     </VerticalTimeline>
    </div>
  );
};


export default Stage2;




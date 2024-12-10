// import React from 'react';
// import { Row, Col, Progress } from 'antd';
// import { UserOutlined, TrophyOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import './Horizontaltimeline.css';


// const HorizontalTimeline = ({ userCreatedDate, projectStatus }) => {
//   // Determine the progress percentage
//   const progressPercentage = projectStatus === 'Completed' ? 100 : 50;


//   return (
//     <div className="container py-4">
//       <Row justify="center" align="middle" gutter={16}>
//         {/* Step 1 */}
//         <Col span={6} className="text-center">
//           <div className="circle ant-timeline-item-head-blue"><UserOutlined /></div>
//           <div className="mt-2">
//             <div className="font-weight-bold">User Created</div>
//             <div className="text-muted">{moment(userCreatedDate).format('DD-MM-YYYY')}</div>
//           </div>
//         </Col>


//         {/* Progress Bar */}
//         <Col span={12} className="text-center">
//           <Progress
//             percent={progressPercentage}
//             showInfo={false}
//             strokeColor={{ from: '#108ee9', to: '#87d068' }}
//           />
//           <div className="mt-2">
//             <div className="font-weight-bold">Waiting for Tasks Completion</div>
//             <div className="text-muted">Tasks are being completed</div>
//           </div>
//         </Col>


//         {/* Step 3 */}
//         <Col span={6} className="text-center">
//           <div className={`circle ${projectStatus === 'Completed' ? 'ant-timeline-item-head-green' : 'ant-timeline-item-head-gray'}`}><TrophyOutlined /></div>
//           <div className="mt-2">
//             <div className="font-weight-bold">Project Completed</div>
//             <div className="text-muted">{projectStatus === 'Completed' ? 'Completed' : 'Pending'}</div>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };


// export default HorizontalTimeline;




import React from 'react';
import { Row, Col, Progress } from 'antd';
import { CheckCircleOutlined, HourglassOutlined } from '@ant-design/icons';
import './Horizontaltimeline.css';


const HorizontalTimeline = ({ stage1Status, stage2Status, stage3Status }) => {
  // Calculate progress based on stages' completion
  const calculateProgress = () => {
    if (stage3Status === 'Done') {
      return 100;
    } else if (stage2Status === 'Done') {
      return 66;
    } else if (stage1Status === 'Done') {
      return 33;
    } else {
      return 0;
    }
  };


  const progressPercentage = calculateProgress();


  return (
    <div className="timeline-container">
      <Row justify="center" align="middle" gutter={16}>
        {/* Stage 1 */}
        <Col span={8} className="text-center">
          <div className={`circle ${stage1Status === 'Done' ? 'ant-timeline-item-head-green' : 'ant-timeline-item-head-gray'}`}>
            {stage1Status === 'Done' ? <CheckCircleOutlined /> : <HourglassOutlined />}
          </div>
          <div className="mt-2">
            <div className="font-weight-bold">Stage 1</div>
            <div className="text-muted">{stage1Status}</div>
          </div>
        </Col>


        {/* Progress Bar */}
        <Col span={8} className="text-center">
          <Progress
            percent={progressPercentage}
            showInfo={false}
            strokeColor={{ from: '#108ee9', to: '#87d068' }}
          />
          <div className="mt-2">
            <div className="font-weight-bold">Stage 2</div>
            <div className="text-muted">{stage2Status}</div>
          </div>
        </Col>


        {/* Stage 3 */}
        <Col span={8} className="text-center">
          <div className={`circle ${stage3Status === 'Done' ? 'ant-timeline-item-head-green' : 'ant-timeline-item-head-gray'}`}>
            {stage3Status === 'Done' ? <CheckCircleOutlined /> : <HourglassOutlined />}
          </div>
          <div className="mt-2">
            <div className="font-weight-bold">Stage 3</div>
            <div className="text-muted">{stage3Status}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};


export default HorizontalTimeline;




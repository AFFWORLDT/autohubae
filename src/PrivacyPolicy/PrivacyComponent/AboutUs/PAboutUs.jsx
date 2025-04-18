import styles from "./PAboutUs.module.css";
import { Helmet } from "react-helmet";

const About = () => {
  const aboutList = [
    {
      heading : "Our Mission",
      content : "At PropFusion CRM, our mission is to empower real estate professionals with cutting-edge technology to enhance their operations, streamline workflows, and maximize sales potential. We provide a powerful, user-friendly CRM platform that helps real estate businesses manage leads, track opportunities, and boost team efficiency.",
      anchor : ""
    },
    {
      heading : "Who We Are",
      content : "PropFusion CRM is a leading customer relationship management platform designed specifically for the real estate industry. Founded in [Year], we’ve grown to become a trusted partner for real estate agencies, brokers, and property managers worldwide. Our platform is built to facilitate smooth communication, automate time-consuming tasks, and provide real-time insights that drive business growth.",
      anchor : ""
    },
    {
      heading : "What We Do",
      content : " Digital Advertising Solutions: We offer a comprehensive platform for businesses to purchase ad space globally, ensuring their messages  reach the right audience at the right time.",
      anchor : ""
    },
    {
      heading : "Real Estate CRM Solutions:",
      content : " PropFusion CRM offers a comprehensive platform to manage leads, properties, clients, and agents—all in one place. Our user-friendly interface ensures seamless management of every aspect of a real estate business, empowering teams to focus on closing deals.",
      anchor : ""
    },
    // {
    //   heading : "Influencer Marketing:",
    //   content : " Our platform connects brands with influencers who can authentically promote their products and services, driving engagement and conversions.",
    //   anchor : ""
    // },
    {
      heading : "Lead Management:",
      content :" With PropFusion CRM, real estate professionals can track leads from various sources, categorize them, and nurture them through the sales funnel. Our system ensures no lead is ever missed, and every opportunity is maximized.",
      anchor : ""
    },
    // {
    //   heading : "Influencer Agents:",
    //   content :" We provide influencer agents to manage and negotiate influencer partnerships, ensuring that both brands and influencers achieve their goals.",
    //   anchor : ""
    // },
    {
      heading : "Property Listing Management:",
      content : "Our platform simplifies the process of listing properties, providing tools to upload, organize, and share property details easily. Whether you're managing a single property or an entire portfolio, PropFusion CRM makes it simple.",
      anchor : ""
    },
    // {
    //   heading : "Ad Space Buying:",
    //   content : "  With our global reach, businesses can buy ad space in various formats and locations, maximizing their visibility and impact. Our Values",
    //   anchor : ""
    // },
    {
      heading : "Team Collaboration:",
      content : "Real estate teams can easily collaborate and stay on top of their tasks with our CRM, which includes features like task management, agent tracking, and automated follow-up reminders. This enhances overall team productivity and coordination.",
      anchor : ""
    },
    {
      heading : "Our Values",
      content : "",
      anchor : ""
    },

    {
      heading : "Innovation:",
      content : "We are dedicated to providing the latest technologies and innovations to our clients. We continuously evolve our platform to keep up with the changing demands of the real estate market.",
      anchor : ""
    },
    {
      heading : "Efficiency:",
      content : "Our platform is designed to help real estate professionals work smarter, not harder. We streamline operations, automate repetitive tasks, and provide insights to enhance decision-making and drive growth.",
      anchor : ""
    },
    {
       heading : "Customer Success:",
       content : " At PropFusion CRM, our top priority is helping our clients succeed. We are committed to providing exceptional customer support and building long-term partnerships with every user.",
       anchor : ""
    },
    {
      heading : "Meet Our Team",
      content : "Our team consists of real estate professionals, technologists, and customer support experts who are passionate about transforming the way real estate businesses operate. We combine industry knowledge with advanced technology to build a CRM platform that truly meets the needs of today’s real estate professionals.",
      anchor : ""
    },
    {
      heading : "Our Vision",
      content : "  Our vision is to be the leading CRM provider in the real estate industry. We strive to help businesses of all sizes grow and succeed by providing innovative, efficient, and scalable CRM solutions tailored specifically to the real estate market.",
      anchor : ""   
    },
    {
      heading : "Join Us on Our Journey",
      content : "Whether you're a real estate agent, broker, or property manager, PropFusion CRM is here to help you streamline your operations, manage your clients and properties more effectively, and drive sales growth. Join us today and experience how our CRM can transform your real estate business.",
      // anchor : [
      //   {
      //     path : "https://Propfusion.io/login",
      //     pathName : "www.Propfusion.com"
      //   }
      // ]
    },
    {
      heading : "",
      content : "For more information about our services and how we can help you achieve your goals, visit our website:",
      anchor : [
        {
          path : "https://www.propfusion.com/",
          pathName : "www.Propfusion.com"
        }
      ]
    },
    {
      heading : "",
      content : "Contact Us",
      anchor : [
        {
          path : "mailto:support@Propfusion.io",
          pathName : "support@Propfusion.io"
        }
      ]
    },
    {
      heading : "Dubai Office:",
      content : " AffWorld Fz LLC 512 ONYX TOWER 2 , Dubai, UAE",
      anchor : ""
    }
  ]
 
  return (
    <>
      <Helmet>
        <title>About Us | Propfusion Policies</title> 
        <meta
          name="description"
          content="Learn about Propfusion.io, an innovative IT company delivering cutting-edge solutions. Meet our expert team and explore our mission to empower businesses globally."
        />
        <meta
          name="keywords"
          content="Propfusion.io, technology experts, digital transformation, About us, Propfusion, Propfusion About Us"
        />
      </Helmet>
    
      <div className={styles.aboutContent}>
       <h1>ABOUT US</h1> 
       {
        aboutList .map((item,index)=><div key={index}> 
                                     <h2>{item.heading}</h2>
                                     <p>{item.content}</p>
                                     <ul>
                                     {item.anchor && item.anchor?.map((AnItem,AnIndex)=><li key={AnIndex}>
                                       <a href={AnItem.path}>{AnItem.pathName}</a>
                                     </li>)            
                                     }
                                    </ul>
                                     </div>)
       }
      </div>
    </>
  );
};

export default About;
import m from "mithril";
import { Section, Flex } from "../../../shared/components/components.js";

export function PrivacyPage(){

  let privacyText= `<div style="text-align:center;font-size:0.9rem"> Last update: 16 May of 2022 </div>  <br>
      <div>This Privacy Policy explains how TenStages ("we," "us," or "our") collects, uses, shares, and protects User 
      information when you use the TenStages Meditation App . We are committed to maintaining the privacy and confidentiality 
      of your personal information. By accessing or using the App, you agree to the terms of this Privacy Policy.</div>
      <div><br></div>
      <div>Information We Collect:</div><div>a. Personal Information: When you register and use the App,
      we may collect personal information, such as your name, email address, and other contact information. 
      We may also collect payment information if you make any purchases within the App.</div><div><br></div>
      <div>b. Usage Information: We may collect information about your interactions with the App, including 
      the meditations you complete, the features you use, and the content you access. This information may include 
      device information, IP address, browser type, operating system, and other usage details.</div><div><br></div>
      <div>How We Use Your Information:</div><div>a. Provide and Improve the App: We use the collected information 
      to deliver, personalize, and improve the functionality and User experience of the App. This includes providing 
      you with access to meditation content, recommending relevant content, and enhancing the overall performance of 
      the App.</div><div><br></div><div>b. Communication: We may use your contact information to communicate with you 
      regarding the App, respond to your inquiries, provide customer support, and send you important notices or 
      updates about the App.</div><div><br></div><div>c. Analytics and Research: We may use the collected information for analytical purposes,
      such as understanding User behavior, usage patterns, and preferences. This helps us improve the App, develop new features,
      and conduct research to enhance our meditation offerings.</div><div><br></div><div>d. Legal Compliance: We may use your information
      to comply with applicable laws, regulations, or legal processes, respond to lawful requests, and protect our rights or the rights of others.
      </div><div><br></div><div>Sharing of Information:</div><div>a. Service Providers: We may engage trusted third-party service providers to 
      perform certain functions on our behalf, such as hosting, data analysis, payment processing, or customer support. These providers have 
      access to your information only to the extent necessary to perform these tasks on our behalf and are obligated to maintain the confidentiality 
      and security of your information.</div><div><br></div><div>b. Aggregated or De-Identified Data: We may share aggregated or de-identified 
      information with third parties for analytical, research, marketing, or other purposes. This information does not personally identify you.
      </div><div><br></div><div>c. Legal Requirements: We may disclose your information if required to do so by law, or if we believe in good faith 
      that such action is necessary to comply with legal obligations, protect our rights, investigate fraud, or respond to a government request.
      </div><div><br></div><div>d. Business Transfers: In the event of a merger, acquisition, or any form of sale or transfer of some or all of our assets, 
      your information may be transferred as part of the transaction. We will notify you via prominent notice on our website or within the App of any 
      change in ownership or use of your personal information.</div><div><br></div><div>Data Security:</div><div>We take reasonable measures to protect 
      your personal information from unauthorized access, disclosure</div>`
  
  return {
      view:(vnode)=>{
          return [
              m(Section,[
                  m(Flex, {direction:'column',  style:'padding:1em;' }, [
                      m.trust(privacyText)
                  ]),
              ])
          ]
      }
  }
}
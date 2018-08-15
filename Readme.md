# Whistle - A decentralised app for Wistleblowers developed as a part of EthIndia 2018 Hackathon at Bangaluru, India.

## Describe your project name. WHAT ARE YOU CALLING IT?

We are calling our platform Whistle. We have chosen this name, as we wanted to build a platform to empower Whistleblowers and those who live under constant fear of death.

## Elevator pitch

To empower individuals and whistleblowers who are living under a constant fear of death, using the Smart Contracts, NuCypher MockNet to store encrypted data on the blockchain using heartbeat function.

## The problem it solves: DESCRIBE WHAT CAN PEOPLE USE IT FOR, OR HOW IT MAKES EXISTING TASKS EASIER/SAFER E.T.C

Recently, Latifa Al Maktoum, a woman belonging to the royal family of Dubai, ran away and came to India as she was being tortured and drugged. She released a video on youtube, where she tells her viewers that if they are watching this, she might already be dead!

We wanted to empower such individuals and whistleblowers who are live under a constant fear of death, to utilize the decentralized blockchain and store encrypted data on the blockchain and using a unique combination of heartbeat transactions and the NuCypher MockNet, allow decryption of the video only after the death of the individual. We also integrated a small platform on top, which uses the recipients stored on the contract to send emails with the link of the data stored on IPFS once the video's hash stored on  the contract is decrypted using our method.

Our platform, Whistle, enables users of our application, to anonymously, store information until their demise. The users of our application are essentially people who are under a fear of death. They are highly paranoid and may not be able to trust any centralized organization which could censor their message. It is important for them to although, keep their message hidden until their demise, as then they can leverage this as a position. 

Examples are people who may be related to influential families or groups, ex-members of cults, people stuck in legal loopholes, or someone who is just afraid that they may die before publishing their findings, such as a whistleblower.

In India, there are multitudes of cases, one such example is the Vyapam scam where "more than 40 people associated with the scam have died since the story broke in 2013" (https://www.firstpost.com/india/mystery-of-vyapam-scam-the-death-toll-keeps-increasing-in-indias-killer-scandal-2316888.html) many of whom were critical witnesses and whistleblowers whose testimony was lost due to their murder.

Through using our platform, the individual could essentially, release all the information even after their demise (checked by not sending a heartbeat message) by sending an email with the files stored on IPFS to all major news outlets.

## NuCypher
-The most critical technology of our platform is the NuCypher mock network. Through this, we are able to perform proxy re-encryption and run a read-only function written in our contract to detect the "is alive" criteria. 

## Smart Contract
- Handling encryption of the data
- Store all the details requried to securely decrypt through the NuCypher mocknet along with a function that can be run by the mocknet to detect if the state on the chain is in agreement with our condition, that the last heartbeat should have been before the current time. (We update this whenever the user checks in with a time in the future)
- Heartbeat: this is updated with the check in which can be performed through our app. 
- Mapping of all users with policy_id which is required by the NuCypher mocknet.

## Challenges we ran into:

We ran into a multitude of problems.
- Understanding and going through the codebase of NuCypher Mocknet and the demos they supplied was a challenging task but we are proud to be able to have implemented the architecture that allowed us to perform off the chain decryption based on a condition stored on chain.

- Being able to implement the heartbeat contract and the flow required to perform the decryption only after the condition was met.

- Interacting with smart contract deployed on private chain.

- We originally tried to use the embark platform and wanted to make a Status.im bot that would query for the heartbeat transaction directly through a message in the chat. But due to a multitude of reasons, such as deprecation of the /debug console command we are not able to go through with this.

## Technologies we used

* Solidity
* Truffle
* NuCypher
* Geth

## Video Demo

[Demo 1](https://drive.google.com/open?id=1sHt_bx0jfDWAHcV7mNjLLCL75rm1X1iW)

[Demo 2](https://drive.google.com/open?id=1DQLfQbrORswS_4Vbm4HOIEQ6NuXloiHQ)

## Credits:

Team ReactOn:
* [Ronak Doshi](https://www.github.com/Ronak-59)
* [Rohan Verma](https://github.com/rhnvrm)
* [Ayush Shukla](https://github.com/MCD-50)

![Team ReactOn](https://drive.google.com/uc?export=view&id=1gpghZFi8nQyyNPA2XsX4h2rlbuJSgVQD)




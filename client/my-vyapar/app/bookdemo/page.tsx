"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
User,
Phone,
Building,
MessageSquare,
Globe
} from "lucide-react";
import Image from "next/image";

export default function BookDemoPage() {

const reviews = [
{
text:"The demo helped me understand how Billora streamlines payment collections.",
name:"Arvind Kumar",
role:"Electronics Distributor"
},
{
text:"Billing became extremely simple for my shop after seeing the demo.",
name:"Rahul Sharma",
role:"Retail Shop Owner"
},
{
text:"Now I track payments easily and accounting is much faster.",
name:"Pooja Verma",
role:"Wholesale Trader"
}
];

const [currentReview,setCurrentReview]=useState(0);
const [success,setSuccess]=useState(false);

useEffect(()=>{
const interval=setInterval(()=>{
setCurrentReview((prev)=>(prev+1)%reviews.length)
},4000)

return()=>clearInterval(interval)
},[])

function handleSubmit(e){
e.preventDefault();
setSuccess(true);

setTimeout(()=>{
setSuccess(false)
},3000)
}

return(

<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e0e7ff] to-[#dbeafe] px-6 py-24">
{/* floating blobs */}

<div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 opacity-30 rounded-full blur-3xl animate-blob"></div>

<div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400 opacity-30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

<div className="absolute top-40 right-40 w-72 h-72 bg-pink-400 opacity-30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

{/* Gradient blobs */}

<div className="absolute w-96 h-96 bg-purple-300 rounded-full blur-[120px] opacity-40 top-10 left-10 animate-pulse"></div>
<div className="absolute w-96 h-96 bg-blue-300 rounded-full blur-[120px] opacity-40 bottom-10 right-10 animate-pulse"></div>


<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

{/* LEFT SECTION */}

<motion.div
initial={{opacity:0,x:-50}}
animate={{opacity:1,x:0}}
transition={{duration:0.7}}
>

<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">

Get your  
<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
 free demo
</span>

</h1>

<p className="mt-6 text-lg text-gray-600 max-w-xl">
See how Billora simplifies billing, inventory and payments
for Indian businesses.
</p>


{/* benefits */}

<ul className="mt-10 space-y-4 text-gray-700">

<li className="flex gap-3 items-center">
<span className="text-green-500 text-xl">✔</span>
Learn GST billing in 15 minutes
</li>

<li className="flex gap-3 items-center">
<span className="text-green-500 text-xl">✔</span>
Manage inventory faster
</li>

<li className="flex gap-3 items-center">
<span className="text-green-500 text-xl">✔</span>
Track payments before due dates
</li>

</ul>


{/* 3 step process */}

<div className="mt-12 grid grid-cols-3 gap-4 text-center">

<motion.div whileHover={{scale:1.1}} className="bg-white p-4 rounded-xl shadow">
<div className="text-2xl"> 1️⃣</div>
<p className="text-sm mt-2">Fill form</p>
</motion.div>

<motion.div whileHover={{scale:1.1}} className="bg-white p-4 rounded-xl shadow">
<div className="text-2xl">2️⃣</div>
<p className="text-sm mt-2">Expert call</p>
</motion.div>

<motion.div whileHover={{scale:1.1}} className="bg-white p-4 rounded-xl shadow">
<div className="text-2xl">3️⃣</div>
<p className="text-sm mt-2">Live demo</p>
</motion.div>

</div>


{/* Review slider */}

<motion.div
key={currentReview}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{duration:0.5}}
className="mt-12 bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg max-w-md"
>

<p className="italic text-gray-700">
"{reviews[currentReview].text}"
</p>

<div className="mt-4">

<p className="font-semibold">
{reviews[currentReview].name}
</p>

<p className="text-sm text-gray-500">
{reviews[currentReview].role}
</p>

</div>

</motion.div>


{/* Trust badges */}

<div className="flex gap-4 mt-10 flex-wrap text-sm">

<div className="bg-white px-4 py-2 rounded-full shadow hover:scale-105 transition">
⭐ 4.7 Rating
</div>

<div className="bg-white px-4 py-2 rounded-full shadow hover:scale-105 transition">
🏆 Trusted by 1Cr+
</div>

<div className="bg-white px-4 py-2 rounded-full shadow hover:scale-105 transition">
🔒 100% Secure
</div>

</div>

</motion.div>


{/* RIGHT SIDE */}

<motion.div
initial={{opacity:0,x:50}}
animate={{opacity:1,x:0}}
transition={{duration:0.7}}
className="relative"
>

{/* Floating phone */}

<motion.div
animate={{y:[0,-15,0]}}
transition={{repeat:Infinity,duration:4}}
className="absolute -top-24 right-6 hidden lg:block"
>

{/* <Image
src="/image/phone1.png"
alt="phone"
width={220}
height={420}
/> */}

</motion.div>


{/* FORM */}

<div className="bg-white/80 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/40">

<h2 className="text-2xl font-semibold mb-6">
Schedule your demo
</h2>

<form onSubmit={handleSubmit} className="space-y-5">

<div className="relative">
<User className="absolute left-3 top-3 text-gray-400"/>
<input
type="text"
placeholder="Your Name"
className="w-full border pl-10 p-3 rounded-lg"
/>
</div>

<div className="relative">
<Phone className="absolute left-3 top-3 text-gray-400"/>
<input
type="text"
placeholder="Mobile Number"
className="w-full border pl-10 p-3 rounded-lg"
/>
</div>

<div className="relative">
<Building className="absolute left-3 top-3 text-gray-400"/>
<input
type="text"
placeholder="Business Name"
className="w-full border pl-10 p-3 rounded-lg"
/>
</div>

<div className="relative">
<MessageSquare className="absolute left-3 top-3 text-gray-400"/>
<select className="w-full border pl-10 p-3 rounded-lg">
<option>Select enquiry type</option>
<option>Product demo</option>
<option>Pricing enquiry</option>
</select>
</div>

<div className="relative">
<Globe className="absolute left-3 top-3 text-gray-400"/>
<select className="w-full border pl-10 p-3 rounded-lg">
<option>Select language</option>
<option>Hindi</option>
<option>English</option>
<option>Bengali</option>
<option>Tamil</option>
<option>Telugu</option>
</select>
</div>

<button
type="submit"
className="w-full py-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition"
>
Book My Demo
</button>

</form>

</div>

</motion.div>

</div>


{/* success popup */}

{success && (

<div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">

Demo request submitted successfully 🚀

</div>

)}

</div>

)
}
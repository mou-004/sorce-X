import {useState} from "react";
import {addSource} from "../services/sourceService";

export default function AddSource(){

const [form,setForm]=useState({
sourceName:"",
category:"",
location:"",
productInfo:"",
verificationStatus:"Pending",
rating:0,
notes:"",
lastVerifiedDate:""
});

const change=e=>setForm({...form,[e.target.name]:e.target.value});

async function save(){
 await addSource(form);
 alert("Source Added");
}

return <div className="p-8">
<h1 className="text-3xl font-bold mb-6">Add Source</h1>

<div className="grid gap-4 max-w-xl">

{Object.keys(form).map(key=>
 key!=="verificationStatus" &&
 <input
 key={key}
 name={key}
 placeholder={key}
 onChange={change}
 className="border rounded p-3"
 />
)}

<select
name="verificationStatus"
onChange={change}
className="border rounded p-3">

<option>Pending</option>
<option>Verified</option>
<option>Rejected</option>

</select>

<button
onClick={save}
className="bg-black text-white rounded p-3">
Save Source
</button>

</div>
</div>
}
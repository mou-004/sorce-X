export default function Sources(){
return <div className="mt-10 bg-white rounded-2xl shadow p-6">
<div className="flex justify-between mb-5">
<h2 className="text-2xl font-bold">Source Management</h2>
<button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
+ Add Source
</button>
</div>
<table className="w-full">
<thead className="bg-slate-100">
<tr>
<th className="p-3 text-left">Source</th>
<th>Category</th>
<th>Status</th>
<th>Rating</th>
</tr>
</thead>
<tbody>
<tr>
<td className="p-3">Premium Supplier</td>
<td className="text-center">Manufacturing</td>
<td className="text-center text-green-600">Verified</td>
<td className="text-center">★★★★★</td>
</tr>
</tbody>
</table>
</div>
}
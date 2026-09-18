import {collection,addDoc,getDocs,updateDoc,doc} from 'firebase/firestore'
import {db} from '../firebase/config'

const ref=collection(db,'sources')

export const createSource=(data)=>addDoc(ref,data)

export async function fetchSources(){
const snap=await getDocs(ref)
return snap.docs.map(x=>({id:x.id,...x.data()}))
}

export const editSource=(id,data)=>
updateDoc(doc(db,'sources',id),data)
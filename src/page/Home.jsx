import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom'
import { FaRegEdit } from "react-icons/fa"
import { IconContext } from 'react-icons'
import Navbar from '../component/Navbar'

function Home() {

  const [data, setData] = useState([]);

  const orderRef = collection(db, "orders");
  useEffect(() => {
    const unsubscribe = loadRealtime();
    return () => {
      unsubscribe();
    }
  }, []);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(orderRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(newData)
    })
    return () => {
      unsubscribe();
    }
  }

  return (
    <>
      <Navbar />
      <div className='p-10'>
        <Link to="/add" className='btn btn-secondary'>เพิ่มรายการสั่งซื้อ</Link>
      </div>
      <div className="flex flex-col items-center">
        <div className="shadow-xl bg-white border-1 border-slate-300 px-6 py-6 rounded-lg overflow-x-auto" style={{ width: "80%", Height: "80%", maxHeight: "75vh" }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Twitter Account</th>
                <th scope="col">ชื่อสินค้า</th>
                <th scope="col" >จำนวน</th>
                <th scope="col">จำนวนเงินค้างชำระ</th>
                <th scope="col">รอบพรีออเดอร์</th>
                <th scope="col">สถานะของสินค้า</th>
                <th scope="col">เลขพัสดุ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) =>
                <tr key={index}>
                  <td>{item.account}</td>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
                  <td>{Number(item.value).toLocaleString()}</td>
                  <td>{item.about}</td>
                  <td>{item.status}</td>
                  <td>{item.trackingNumber}</td>
                  <td>
                    <Link to={`/edit/${item.id}`}>
                      <IconContext.Provider value={{ size: '20px' }}>
                        <div><FaRegEdit /></div>
                      </IconContext.Provider>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Home
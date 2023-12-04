import { useState } from 'react'
import PropTypes from 'prop-types'

const ModalForm = ({ addTrackedObject }) => {
 const [showModal, setShowModal] = useState(false)
 const [formData, setFormData] = useState({
  name: '',
 })

 const handleChange = (e) => {
  const { name, value } = e.target
  setFormData({ ...formData, [name]: value })
 }

 const handleSubmit = (e) => {
  e.preventDefault()
  addTrackedObject(formData)
  setFormData({
   name: '',
  })
  setShowModal(false)
 }

 const toggleModal = () => {
  setShowModal(!showModal)
 }

 return (
  <div className='rounded-lg w-full'>
   <button
    onClick={toggleModal}
    className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg  text-lg px-5 py-2.5 text-center inline-flex items-center justify-center w-full ${
     showModal ? 'bg-white text-gray-900' : ''
    }`}
   >
    {showModal ? 'CANCEL' : 'ADD OBJECT'}
   </button>

   {showModal && (
    <div className='mt-4'>
     <div className='modal border border-gray-300 p-5 rounded-lg text-center'>
      <div className='modal-content'>
       <form onSubmit={handleSubmit} className='flex flex-col'>
        <div className='flex mb-5'>
         <label className='w-1/6 mr-3  text-lg font-semibold text-gray-900 flex items-center justify-center'>
          OBJECT
         </label>
         <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='flex-1 bg-gray-50 border border-gray-300 text-gray-900  text-lg rounded-lg p-2.5'
          required
         />
        </div>
        <button
         type='submit'
         className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg  text-lg px-5 py-2.5 text-center flex items-center justify-center`}
        >
         ADD OBJECT
        </button>
       </form>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}

ModalForm.propTypes = {
 addTrackedObject: PropTypes.func.isRequired,
}

export default ModalForm

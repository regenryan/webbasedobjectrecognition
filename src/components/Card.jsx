import PropTypes from 'prop-types'

const Card = ({
 object,
 isDetected,
 detectedObjectInfo,
 removeTrackedObject,
}) => {
 const handleRemoveClick = () => {
  removeTrackedObject(object.name)
 }

 const { position, width, height, score } = detectedObjectInfo

 return (
  <div
   className={`relative flex flex-col py-5 rounded-lg border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 ${
    isDetected ? 'bg-green-200' : 'bg-white'
   } p-5 mb-4`}
  >
   <div className='flex justify-between items-center mb-3'>
    <h3 className='text-m font-bold uppercase text-left'>{object.name}</h3>
    <button
     onClick={handleRemoveClick}
     className='absolute hover:bg-black hover:bg-opacity-5 font-medium rounded-lg  text-lg px-3 py-1.5 top-3 right-3'
     style={{ zIndex: 10 }}
    >
     &times;
    </button>
   </div>
   <div className='flex flex-col gap-1'>
    <h3 className='text-s uppercase text-left'>
     POS-x: {position ? position.x.toFixed(2) : '0.00'}
    </h3>
    <h3 className='text-s uppercase text-left'>
     POS-y: {position ? position.y.toFixed(2) : '0.00'}
    </h3>
    <h3 className='text-s uppercase text-left'>
     Width: {width ? width.toFixed(2) : '0.00'}
    </h3>
    <h3 className='text-s uppercase text-left'>
     Height: {height ? height.toFixed(2) : '0.00'}
    </h3>
    <h3 className='text-s uppercase text-left'>
     Confidence: {score ? score.toFixed(2) : '0.00'}
    </h3>
   </div>
  </div>
 )
}

Card.propTypes = {
 object: PropTypes.shape({
  name: PropTypes.string.isRequired,
 }),
 isDetected: PropTypes.bool.isRequired,
 detectedObjectInfo: PropTypes.shape({
  position: PropTypes.shape({
   x: PropTypes.number,
   y: PropTypes.number,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  score: PropTypes.number,
 }),
 removeTrackedObject: PropTypes.func.isRequired,
}

export default Card

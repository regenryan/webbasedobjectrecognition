import PropTypes from 'prop-types'
import Card from './Card'

const Cards = ({ objects, detectedObjects, removeTrackedObject }) => {
 const isDetected = (name) => {
  return detectedObjects.some((obj) => obj.name === name)
 }

 const groupDetectedObjects = detectedObjects.reduce((groups, obj) => {
  const name = obj.name
  if (!groups[name]) {
   groups[name] = []
  }
  groups[name].push(obj)
  return groups
 }, {})

 return (
  <div className='flex flex-wrap content-center w-854 gap-5 justify-center'>
   {objects.map((object) => {
    const detectedObjectsByName = groupDetectedObjects[object.name] || []

    if (detectedObjectsByName.length === 0) {
     return (
      <Card
       key={`${object.name}_empty`}
       object={object}
       isDetected={false}
       detectedObjectInfo={{}}
       removeTrackedObject={removeTrackedObject}
      />
     )
    }

    return detectedObjectsByName.map((detectedObject, idx) => (
     <Card
      key={`${object.name}_${idx}`}
      object={object}
      isDetected={isDetected(object.name)}
      detectedObjectInfo={detectedObject}
      removeTrackedObject={removeTrackedObject}
     />
    ))
   })}
  </div>
 )
}

Cards.propTypes = {
 objects: PropTypes.arrayOf(
  PropTypes.shape({
   name: PropTypes.string.isRequired,
  })
 ),
 detectedObjects: PropTypes.arrayOf(PropTypes.object),
 removeTrackedObject: PropTypes.func.isRequired,
}

export default Cards

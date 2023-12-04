// eslint-disable-next-line no-unused-vars
import React from 'react'
import './App.css'
import Cards from './components/Cards'
import ModalForm from './components/ModalForm'

import { useState, useRef, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import * as tf from '@tensorflow/tfjs'
import * as cocossd from '@tensorflow-models/coco-ssd'
import Webcam from 'react-webcam'
import './App.css'
import { drawRect } from './utilities'

const App = () => {
 const [detectedObjects, setDetectedObjects] = useState([])
 const [trackedObjects, setTrackedObjects] = useState([])

 const [selectedVideoSource, setSelectedVideoSource] = useState('none')
 const [uploadedVideo, setUploadedVideo] = useState(null)
 const [videoPlaying, setVideoPlaying] = useState(false)

 const webcamRef = useRef(null)
 const canvasRef = useRef(null)
 const videoRef = useRef(null)

 const runCoco = async () => {
  const net = await cocossd.load()

  const detect = async () => {
   if (selectedVideoSource === 'webcam') {
    if (
     typeof webcamRef.current !== 'undefined' &&
     webcamRef.current !== null &&
     webcamRef.current.video.readyState === 4
    ) {
     const video = webcamRef.current.video
     const videoWidth = webcamRef.current.video.videoWidth
     const videoHeight = webcamRef.current.video.videoHeight

     webcamRef.current.video.width = videoWidth
     webcamRef.current.video.height = videoHeight

     canvasRef.current.width = videoWidth
     canvasRef.current.height = videoHeight

     const obj = await net.detect(video)

     const ctx = canvasRef.current.getContext('2d')
     drawRect(obj, ctx)

     const formattedObjects = obj.map((object) => {
      return {
       name: object.class,
       position: {
        x: object.bbox[0],
        y: object.bbox[1],
       },
       width: object.bbox[2],
       height: object.bbox[3],
       score: object.score,
      }
     })

     setDetectedObjects(formattedObjects)
    }
   } else if (
    selectedVideoSource === 'videoFile' &&
    uploadedVideo &&
    videoPlaying
   ) {
    const video = videoRef.current

    if (video && video.readyState >= 1) {
     // Ensure the video is loaded and ready
     const videoWidth = video.videoWidth
     const videoHeight = video.videoHeight

     canvasRef.current.width = videoWidth
     canvasRef.current.height = videoHeight

     const obj = await net.detect(video)

     const ctx = canvasRef.current.getContext('2d')
     drawRect(obj, ctx)

     const formattedObjects = obj.map((object) => {
      return {
       name: object.class,
       position: {
        x: object.bbox[0],
        y: object.bbox[1],
       },
       width: object.bbox[2],
       height: object.bbox[3],
       score: object.score,
      }
     })

     setDetectedObjects(formattedObjects)
    }
   }
  }

  setInterval(detect, 2000)
 }

 useEffect(() => {
  runCoco()
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [selectedVideoSource, uploadedVideo, videoPlaying])

 const handleVideoChange = (event) => {
  const file = event.target.files[0]
  setUploadedVideo(URL.createObjectURL(file))
  setSelectedVideoSource('videoFile')
  setVideoPlaying(true) // Start playing the new video
 }

 const addTrackedObject = (newObject) => {
  setTrackedObjects([...trackedObjects, newObject])
 }

 const removeTrackedObject = (objectName) => {
  const updatedTrackedObjects = trackedObjects.filter(
   (obj) => obj.name !== objectName
  )
  setTrackedObjects(updatedTrackedObjects)
 }

 return (
  <div className='App'>
   <div className='flex flex-col gap-16 px-48 py-20 items-center'>
    <h1 className='text-5xl '>Web Based Object Recognition</h1>
    <div className='bg-black w-854 h-480 rounded-3xl aspect-auto'>
     {selectedVideoSource === 'videoFile' && uploadedVideo && (
      <video
       ref={videoRef}
       className='absolute mx-auto left-0 right-0 text-center z-10 w-854 h-480  rounded-3xl'
       controls
       autoPlay={videoPlaying}
       onPlay={() => setVideoPlaying(true)}
       onLoadedMetadata={() => {
        const video = videoRef.current
        if (video) {
         const videoWidth = video.videoWidth
         const videoHeight = video.videoHeight

         canvasRef.current.width = videoWidth
         canvasRef.current.height = videoHeight
        }
       }}
      >
       <source src={uploadedVideo} type='video/mp4' />
       Your browser does not support the video tag.
      </video>
     )}
     {selectedVideoSource === 'webcam' && (
      <Webcam
       ref={webcamRef}
       muted={true}
       className='absolute mx-auto left-0 right-0 text-center z-10 w-854 h-480 rounded-3xl'
      />
     )}
     <canvas
      ref={canvasRef}
      className='absolute mx-auto left-0 right-0 text-center z-10 w-854 h-480 rounded-3xl'
     />
    </div>
    <div className='flex items-center gap-5 w-full'>
     <h3 className='font-semibold text-lg'>SOURCE</h3>
     <select
      value={selectedVideoSource}
      onChange={(e) => setSelectedVideoSource(e.target.value)}
      className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg  text-lg px-2.5 py-1.5 inline-flex items-center w-full max-w-full`}
      style={{ height: '2.5rem' }}
     >
      <option value='webcam'>WEBCAM</option>
      <option value='videoFile'>UPLOAD VIDEO</option>
      <option value='none'>NONE</option>
     </select>
     
     {selectedVideoSource === 'videoFile' && (
      <>
       <input
        type='file'
        accept='video/mp4,video/x-m4v,video/*'
        onChange={handleVideoChange}
        className='hidden'
       />
       <label
        htmlFor='fileInput'
        className='text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg  text-lg px-4 py-2 inline-flex items-center cursor-pointer'
       >
        <span className='uppercase'>Upload</span>
        <input
         id='fileInput'
         type='file'
         accept='video/mp4,video/x-m4v,video/*'
         onChange={handleVideoChange}
         className='hidden'
        />
       </label>
      </>
     )}
    </div>

    <Cards
     objects={trackedObjects}
     detectedObjects={detectedObjects}
     removeTrackedObject={removeTrackedObject}
    />
    <ModalForm addTrackedObject={addTrackedObject} />
   </div>
  </div>
 )
}
export default App

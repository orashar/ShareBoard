import React, { useEffect, useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'
import io from 'socket.io-client'
import './styles/board.css'

/**
* @author
* @function Board
**/

const Board = (props) => {
    
    
    const canvasRef = useRef(null)
    const colorsRef = useRef(null)
    const sizesRef = useRef(null)
    const socketRef = useRef()


    const nickname = prompt('Please Enter your Name')
    const roomname = props.match.params.roomname
    console.log(roomname, nickname)
    console.log(roomname)

    const [brushSize, setBrushSize] = useState(1)
    

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const colors = document.getElementsByClassName('color')
        const sizes = document.getElementsByClassName('size')
        const current = {
            color: 'black',
            size: 1,
        }
        const onColorUpdate = (e) => {
            current.color = e.target.className.split(' ')[1]
        }
        const onSizeUpdate = (e) => {
            current.size = e.target.className.split(' ')[2]
        }
        for(let i = 0; i < colors.length; i++){
            colors[i].addEventListener('click', onColorUpdate, false)
        }
        for(let i = 0; i < sizes.length; i++){
            sizes[i].addEventListener('click', onSizeUpdate, false)
        }
        let drawing = false;
        const drawLine = (x0, y0, x1, y1, color,size, emit) => {
            console.log("drawline called")
            context.beginPath()
            context.moveTo(x0, y0)
            context.lineTo(x1, y1)
            context.strokeStyle = color
            context.lineWidth = size
            context.stroke()
            context.closePath()
    
            if(!emit) return
            const w = canvas.width
            const h = canvas.height
    
            socketRef.current.emit('drawing', {
                x0: x0/w,
                y0: y0/h,
                x1: x1/w,
                y1: y1/h,
                color,
                size,
            }, roomname)
        }
    
        const onMouseDown = (e) => {
            drawing = true
            current.x = e.clientX || e.touches[0].clientX
            current.y = e.clientY || e.touches[0].clientY
        }
        const onMouseMove = (e) => {
            if(!drawing) return
            drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, current.size, true)
            current.x = e.clientX || e.touches[0].clientX
            current.y = e.clientY || e.touches[0].clientY
        }
        const onMouseUp = (e) => {
            if(!drawing) return
            drawing = false
            drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches.clientY, current.color, current.size, true)
        }
        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime()
            return function(){
                const time = new Date().getTime()

                if((time-previousCall) >= delay){
                    previousCall = time
                    callback.apply(null, arguments)
                }
            }
        }


        canvas.addEventListener('mousedown', onMouseDown, false)
        canvas.addEventListener('mouseup', onMouseUp, false)
        canvas.addEventListener('mouseout', onMouseUp, false)
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false)

        canvas.addEventListener('touchstart', onMouseDown, false)
        canvas.addEventListener('touchend', onMouseUp, false)
        canvas.addEventListener('touchcancel', onMouseUp, false)
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false)

        const onResize = () => {
            const t_canvas = document.createElement("canvas")
            const t_context = t_canvas.getContext('2d')
            t_canvas.width = window.innerWidth
            t_canvas.height = window.innerHeight

            t_context.fillStyle = "teal"
            t_context.fillRect(0,0,window.innerWidth, window.innerHeight)
            t_context.drawImage(canvas, 0, 0)
            // const image = canvas.toDataURL()
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            context.drawImage(t_canvas, 0, 0)
            // var p = window.innerWidth / canvas.width;
            // canvas.width *= p;
            // canvas.height *= p;

            // var scaleFactor = context.scaleFactor || 1;
            // context.scale(p * scaleFactor, p * scaleFactor);
            // context.scaleFactor = p * scaleFactor;
        } 
        window.addEventListener('resize', onResize, false)
        onResize()

        const onDrawingEvent = (data) => {
            console.log("drawing")
            const w = canvas.width
            const h = canvas.height
            drawLine(data.x0*w, data.y0*h, data.x1*w, data.y1*h, data.color, data.size, false)
        }
        socketRef.current = io.connect('http://localhost:8080/')
        socketRef.current.emit('join', nickname, roomname)
        socketRef.current.on('drawing', onDrawingEvent)
        socketRef.current.on('drawing_history_data', datas => {
            datas.forEach(data => {
                console.log("drawing")
                const w = canvas.width
                const h = canvas.height
                drawLine(data.x0*w, data.y0*h, data.x1*w, data.y1*h, data.color, data.size, false)
            });
        })

        console.log("socket = ", socketRef.current)
    }, [])

  return(
    <div>
        <canvas ref={canvasRef} className="whiteboard"/>
        <div ref={colorsRef} className="colors">
            <div className="color black"/>
            <div className="color red"/>
            <div className="color blue"/>
            <div className="color green"/>
            <div className="color yellow"/>
            <div className="color teal"/>
        </div>
        <div ref={sizesRef} className="sizes">
            <div className="size bsize 1">1</div>
            <div className="size bsize 2">2</div>
            <div className="size bsize 3">3</div>
            <div className="size bsize 4">4</div>
            <div className="size bsize 5">5</div>
        </div>
    </div>
   )

 }

export default Board;
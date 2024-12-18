const { Engine, Render, Runner, Bodies, Body, Composite, Constraint, World, Events } = Matter;

let engine = Engine.create();
let world = engine.world;
let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create the render engine for visualizing physics
let render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: '#87CEEB' // Light blue for the sky
    }
});

// Ground
let ground = Bodies.rectangle(canvas.width / 2, canvas.height - 50, canvas.width, 100, { isStatic: true });

// Car (a rectangle for simplicity)
let carBody = Bodies.rectangle(200, 300, 100, 40);
let frontWheel = Bodies.circle(240, 340, 20);
let rearWheel = Bodies.circle(160, 340, 20);

// Add car constraints
let frontAxle = Constraint.create({
    bodyA: carBody,
    pointA: { x: 40, y: 20 },
    bodyB: frontWheel,
    stiffness: 0.5
});
let rearAxle = Constraint.create({
    bodyA: carBody,
    pointA: { x: -40, y: 20 },
    bodyB: rearWheel,
    stiffness: 0.5
});

// Add objects to the world
Composite.add(world, [ground, carBody, frontWheel, rearWheel, frontAxle, rearAxle]);

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
function createHills() {
    let lastX = 0;
    let hillWidth = 100;
    let hillPoints = [];
    
    for (let i = 0; i < canvas.width / hillWidth + 1; i++) {
        let x = lastX + hillWidth;
        let y = canvas.height - (Math.sin(i * 0.5) * 150 + 200); // Sine wave hills
        hillPoints.push({ x: x, y: y });
        lastX = x;
    }
    
    let hillBodies = [];
    for (let i = 0; i < hillPoints.length - 1; i++) {
        let hill = Bodies.rectangle((hillPoints[i].x + hillPoints[i + 1].x) / 2, (hillPoints[i].y + hillPoints[i + 1].y) / 2, hillWidth, 20, { isStatic: true });
        hillBodies.push(hill);
    }

    Composite.add(world, hillBodies);
}

createHills();
let forceMagnitude = 0.05;
document.getElementById('accelerate').addEventListener('click', () => {
    Body.applyForce(carBody, { x: carBody.position.x, y: carBody.position.y }, { x: forceMagnitude, y: 0 });
});

document.getElementById('brake').addEventListener('click', () => {
    Body.applyForce(carBody, { x: carBody.position.x, y: carBody.position.y }, { x: -forceMagnitude, y: 0 });
});
Events.on(engine, 'afterUpdate', function() {
    let offsetX = -carBody.position.x + canvas.width / 2;
    Render.lookAt(render, {
        min: { x: carBody.position.x - 400, y: 0 },
        max: { x: carBody.position.x + 400, y: canvas.height }
    });
});

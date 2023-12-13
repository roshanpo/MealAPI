const express = require('express')
const axios = require('axios')
const _ = require('lodash');
const cors = require('cors')
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const specs = require('./docs/specs');
const app = express()
const port = 8000

app.use(cors())

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'recipie',
    password: 'polkpolk',
    port: 5432
  });


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/test-db-connection', async (req, res) => {
    try {
      // Get a client from the pool
      const client = await pool.connect();
  
      // Perform a simple query to test the connection
      const { rows } = await client.query('SELECT NOW()');
  
      // Release the client back to the pool
      client.release();
  
      // Respond with the result
      res.json({ success: true, result: rows });
    } catch (error) {
      // If an error occurs, handle it
      res.status(500).json({ success: false, error: error.message });
    }
  });

/*app.get('/recipies',async (req,res) =>{
    try {
    //const {data} = axios.get('www.themealdb.com/api/json/v1/1/filter.php?a=Canadian')
    const apiUrl = 'https://themealdb.com/api/json/v1/1/search.php?f=p'; // Replace with your API endpoint

    const response = await axios.get(apiUrl);
    const data = response.data.meals;
    for (const meal of data) {
        const {
          idMeal,
          strMeal,
          strCategory,
          strArea,
          strInstructions,
          strMealThumb,
          strTags,
          strYoutube,
          strIngredient1,
          strIngredient2,
          strIngredient3,
          strIngredient4,
          strIngredient5,
          strIngredient6,
          strIngredient7,
          strIngredient8,
          strIngredient9,
          strIngredient10
        } = meal;

        const insertQuery = `
  INSERT INTO meals_table (
    idMeal,
    strMeal,
    strCategory,
    strArea,
    strInstructions,
    strMealThumb,
    strTags,
    strYoutube,
    strIngredient1,
    strIngredient2,
    strIngredient3,
    strIngredient4,
    strIngredient5,
    strIngredient6,
    strIngredient7,
    strIngredient8,
    strIngredient9,
    strIngredient10
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
`;

await pool.query(insertQuery, [
  idMeal,
  strMeal,
  strCategory,
  strArea,
  strInstructions,
  strMealThumb,
  strTags,
  strYoutube,
  strIngredient1,
  strIngredient2,
  strIngredient3,
  strIngredient4,
  strIngredient5,
  strIngredient6,
  strIngredient7,
  strIngredient8,
  strIngredient9,
  strIngredient10
]);

        //console.log(idMeal,strArea,strInstructions);
    }
    res.json({ message: 'Data fetched and stored successfully' });
}
catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).json({ message: 'Error fetching and storing data' });
  }
    //res.json(data);
    //console.log(data.meals);
    //res.send(data);
})*/

app.get('/ingredients', async (req, res) => {
    try {
    let {dish} = req.query;
    dish = dish.replace(/^"|"$/g, '');
    const upperFirstMeal = _.upperFirst(dish);
      //const client = await pool.connect();
      const result = await pool.query('SELECT stringredient1, stringredient2, stringredient3, stringredient4, stringredient5, stringredient6, stringredient7, stringredient8, stringredient9, stringredient10 FROM meals_table WHERE strmeal = $1',[dish]);
      //client.release();
  
      res.json(result.rows); // Return the fetched data as JSON
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

/*app.get('/matchingredients', async (req,res) =>{
  try{
    let {ingredients} = req.query
    //const str = "item1, item2, item3, item4, item5"; // Your string with items separated by comma
    const itemsArray = ingredients.split(",")
    const dish = [];
    itemsArray.forEach(async(item) => {
      const query = `SELECT idmeal, strmeal FROM meals_table 
      WHERE $1 IN (stringredient1) OR $1 IN (stringredient2)OR $1 IN(stringredient3) OR $1 IN (stringredient4) OR $1 IN (stringredient5)`;

    // Execute the query with variable substitution
    const result = await pool.query(query, [item]);
    dish.push(result.rows)
    console.log(dish);
    })
    
    res.json(itemsArray)
    
  }
  catch(error){
    console.error(error)
  }
})*/

/**
 * @swagger
 * /allrecipies:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieves a list of all recipes from the meals_table.
 *     responses:
 *       '200':
 *         description: A list of recipes successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   recipeId:
 *                     type: integer
 *                     description: The ID of the recipe.
 *                   recipeName:
 *                     type: string
 *                     description: The name of the recipe.
 *                   description:
 *                     type: string
 *                     description: Description of the recipe.
 *                   preparationTime:
 *                     type: string
 *                     description: The time required for preparation.
 *                   serving:
 *                     type: integer
 *                     description: Number of servings.
 *     '404':
 *         description: No recipes found.
 *     '500':
 *         description: Internal server error.
 *     security: []
 */

app.get('/allrecipies', async(req,res) =>{
    try{
        const result = await pool.query("SELECT * FROM meals_table")
        const data = result.rows;
        res.json(data)
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
      }
})

/**
 * @swagger
 * /allareas:
 *   get:
 *     summary: Get all areas
 *     description: Retrieves a list of all distinct areas from the meals_table.
 *     responses:
 *       '200':
 *         description: A list of distinct areas successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: A distinct area from meals_table.
 *       '500':
 *         description: Internal server error while fetching data.
 *     security: []
 */

app.get('/allareas', async(req,res) => {
    try{
        const result = await pool.query("SELECT DISTINCT strarea FROM meals_table")
        res.json(result.rows)
    }
    catch (error){
        console.error("Error fetching data: ", error)
        res.status(500).json({ message: 'Error fetching data' });
    }
})



/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get recipes by area
 *     description: Retrieves recipes based on a specific area from the meals_table.
 *     parameters:
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         required: true
 *         description: The area to filter recipes by.
 *     responses:
 *       '200':
 *         description: A list of recipes based on the specified area.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   recipeId:
 *                     type: integer
 *                     description: The ID of the recipe.
 *                   recipeName:
 *                     type: string
 *                     description: The name of the recipe.
 *                   description:
 *                     type: string
 *                     description: Description of the recipe.
 *                   preparationTime:
 *                     type: string
 *                     description: The time required for preparation.
 *                   serving:
 *                     type: integer
 *                     description: Number of servings.
 *       '400':
 *         description: Invalid area parameter.
 *       '500':
 *         description: Internal server error occurred.
 *     security: []
 */



app.get('/recipies', async(req,res) =>{
    try {
        let { area } = req.query;
        area = area.replace(/^"|"$/g, '');
        //console.log(area)
        //const myString = 'hello world';
        const upperFirstArea = _.upperFirst(area);
        const result = await pool.query("SELECT * FROM meals_table WHERE strarea = $1",[upperFirstArea]);
        const data = result.rows; // Extract the rows from the result object
        res.json(data); // Send the fetched data as JSON response
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
      }
})


/**
 * @swagger
 * /getdish:
 *   get:
 *     summary: Get dish details
 *     description: Retrieves details of a dish based on its name from the meals_table.
 *     parameters:
 *       - in: query
 *         name: dish
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the dish to retrieve.
 *     responses:
 *       '200':
 *         description: Details of the specified dish.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dishId:
 *                     type: integer
 *                     description: The ID of the dish.
 *                   dishName:
 *                     type: string
 *                     description: The name of the dish.
 *                   description:
 *                     type: string
 *                     description: Description of the dish.
 *                   category:
 *                     type: string
 *                     description: Category of the dish.
 *                   area:
 *                     type: string
 *                     description: Area of the dish.
 *       '400':
 *         description: Invalid dish parameter.
 *       '500':
 *         description: Internal server error occurred.
 *     security: []
 */


app.get('/getdish', async(req,res) =>{
    try{
        let {dish} = req.query;
        const correctedDish = dish.replace(/^\s*"([^"]*)"\s*$/, '$1');
        console.log(correctedDish);
        const upperFirstMeal = _.upperFirst(correctedDish);
        const result = await pool.query("SELECT * FROM meals_table WHERE strmeal = $1",[upperFirstMeal]);
        const data = result.rows; // Extract the rows from the result object
        res.json(data); // Send the fetched data as JSON response
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
      }
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
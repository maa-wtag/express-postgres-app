const db = require("../config/db");

const User = {
  // Get all users
  async findAll() {
    try {
      const result = await db.query(
        "SELECT * FROM users ORDER BY created_at DESC"
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a single user by ID
  async findById(id) {
    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create a new user
  async create(userData) {
    const { name, email } = userData;
    try {
      const result = await db.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update a user
  async update(id, userData) {
    const { name, email } = userData;
    try {
      const result = await db.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Delete a user
  async delete(id) {
    try {
      const result = await db.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = User;

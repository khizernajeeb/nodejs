class Repository {
  constructor(modelInstance) {
    this.modelInstance = modelInstance;
  }

  findRecord(where = {}, attributes, include, options = {}) {
    let params = { where };
    if (attributes) {
      params.attributes = attributes;
    }
    if (include) {
      params.include = include;
    }
    if (options) {
      params = {
        ...params,
        ...options,
      };
    }
    return this.modelInstance.findOne(params);
  }

  findAllRecords(where = {}, attributes, include, options = {}, plain = false) {
    let params = { where };
    if (attributes) {
      params.attributes = attributes;
    }
    if (include) {
      params.include = include;
    }
    if (options) {
      params = {
        ...params,
        ...options,
      };
    }
    const instance = this.modelInstance.findAll(params);
    return plain ? instance.map(el => el.get({ plain: true })) : instance;
  }

  updateRecord(where = {}, values, options = {}) {
    return new Promise((resolve, reject) => {
      const params = {
        where,
        returning: true,
        ...options,
      };
      this.modelInstance
        .update(values, params)
        .then(updatedValues => {
          let returnValues = null;
          if (updatedValues[0]) {
            returnValues = updatedValues[1][0];
          }
          resolve(returnValues);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  updateRecords(where = {}, values, options = {}) {
    return new Promise((resolve, reject) => {
      const params = {
        where,
        returning: true,
        ...options,
      };
      this.modelInstance
        .update(values, params)
        .then(updatedValues => {
          const rowsUpdated = updatedValues[0];
          const rowsValues = updatedValues[1];
          resolve({ rowsUpdated, rowsValues });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  createRecord(values, options = {}) {
    return this.modelInstance.create(values, options);
  }

  createOrUpdate(values, options = {}) {
    return this.modelInstance.upsert(values, options);
  }

  createBulkRecords(data, options = {}) {
    return this.modelInstance.bulkCreate(data, options);
  }

  deleteRecord(whereObject, options) {
    const params = {
      where: whereObject,
      ...options,
    };
    return this.modelInstance.destroy(params);
  }

  /**
   * updateBulkRecords
   * This function is used for bulk update of records and follows
   * table map updation strategy by creating temporary table and mapping it to update all records.
   * @param {*} dbInstance (sequelize db instance)
   * @param {*} referenceKey (usually the primary key id used for joining data from temporary table)
   * @param {*} [columnsToUpdate=[]] (columns that needs to update in a record)
   * @param {*} updatedRows (all the updated records)
   * (these records should contain the refrence key and all columns mentioned in columnsToUpdate)
   * @returns Transaction Promise
   * @memberof Repository
   */
  async updateBulkRecords(dbInstance, referenceKey, columnsToUpdate = [], updatedRows) {
    if (updatedRows && updatedRows.length) {
      const tableToUpdate = this.modelInstance.tableName;
      const tempKey = `compare_key_${referenceKey}`;
      const tempTable = `new_ref_${tableToUpdate}`;

      const columnsUpdateString = columnsToUpdate.map(column => `${column} = sncopy.${column}`);
      // await dbInstance.sequelize.query(removeTable);
      const updateQuery = `UPDATE ${tableToUpdate} SET ${columnsUpdateString.join(
        ',',
      )} FROM ${tempTable} AS sncopy WHERE ${referenceKey} = sncopy.${tempKey};`;
      const insertRecords = updatedRows.map(row => {
        const newRecord = { ...row, [tempKey]: row[referenceKey] };
        delete newRecord[`${referenceKey}`];
        return newRecord;
      });
      const columns = Object.keys(insertRecords[0]);
      const newTableColumns = columns
        .map(
          col => `${col} ${typeof insertRecords[0][col] === 'number' ? 'int4' : 'varchar (100)'}`,
        )
        .join(',');

      const createTable = `CREATE TEMPORARY TABLE ${tempTable} (${newTableColumns}) ON COMMIT DROP;`;

      const entriesToInsert = [];
      for (let i = 0; i < insertRecords.length; i += 1) {
        const record = insertRecords[i];
        const values = Object.values(record);
        entriesToInsert.push(`(${values.join(',')})`);
      }

      const bulkInsertQuery = `INSERT INTO ${tempTable} (${columns.join(
        ',',
      )}) VALUES ${entriesToInsert.join(',')};`;

      return dbInstance.sequelize.transaction(async t1 => {
        await dbInstance.sequelize.query(createTable, { transaction: t1 });

        await dbInstance.sequelize.query(bulkInsertQuery, { transaction: t1 });

        await dbInstance.sequelize.query(updateQuery, { transaction: t1 });
      });
    } else {
      throw new Error('records to update not found');
    }
  }
}

module.exports = Repository;

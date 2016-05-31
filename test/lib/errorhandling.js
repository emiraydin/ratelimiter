var errorHandlingTests = function() {

  describe("Constructing Limit object", function() {


    it("Limit has no key name", function() {

      assert.throws(
        function() {
          new Limit(null, 5, 2000);
        },
        Error, "You have to set a key name for this limit!");

    });

    it("Limit has no TTL", function() {

      assert.throws(
        function() {
          new Limit("keyName", null, 2000);
        },
        Error, "You have to set a TTL for keyName");

    });

    it("Limit has no max calls", function() {

      assert.throws(function() {
        new Limit("keyName", 5, null);
      },
      Error, "You have to set a max limit for keyName");

    });

  });

};

module.exports = errorHandlingTests;

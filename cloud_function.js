Moralis.Cloud.define("userList", async (request) => {
    // We will get ACL of request and check "role:Administrator"
    requestJson = JSON.parse(JSON.stringify(request.user));
    ACLJson = JSON.parse(JSON.stringify(requestJson.ACL));
  
    if("role:Administrator" in ACLJson) {
      const selectList = ["username", "accounts"];
      // We don't need to provide "coreservices" user
      query = new Moralis.Query("User").notEqualTo("username", "coreservices");
      query.select(selectList);
      userData = await query.find({ useMasterKey: true });
  
      userJson = JSON.stringify(userData);
  
      return userJson;
    }
    else {
      throw "Unauthorized"
    }
  });
  
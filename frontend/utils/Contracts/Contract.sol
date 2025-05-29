// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct Property {
        address seller;
        address buyer;
        string landImage;
        string location;
        string googleMapLink;
        string size;
        string price;
        string description;
        string landType;
        string saleDeed;
        string clearanceCertificates;
        string propertyTaxDocument;
        string encumbranceCertificate;
        string propertyVerification;
        string registrationRequest;
        string marketStatus;
        string transactionData;
        uint256 registrationDate; 
    }

    Property[] private properties;

    event PropertyAdded(
        uint256 indexed propertyId,
        address indexed seller,
        string location,
        string price
    );

    event PropertyVerified(
        uint256 indexed propertyId,
        string propertyVerification
    );

    event PropertyRequested(
        uint256 indexed propertyId,
        address indexed buyer
    );

    event PropertyApproved(
        uint256 indexed propertyId,
        address indexed seller,
        address indexed buyer,
        uint256 registrationDate
    );

    function addProperty(
        string memory _landImage,
        string memory _location,
        string memory _googleMapLink,
        string memory _size,
        string memory _price,
        string memory _description,
        string memory _landType,
        string memory _saleDeed,
        string memory _clearanceCertificates,
        string memory _propertyTaxDocument,
        string memory _encumbranceCertificate
    ) public {
        uint256 propertyId = properties.length;

        properties.push(
            Property({
                seller: msg.sender,
                buyer: address(0),
                landImage: _landImage,
                location: _location,
                googleMapLink: _googleMapLink,
                size: _size,
                price: _price,
                description: _description,
                landType: _landType,
                saleDeed: _saleDeed,
                clearanceCertificates: _clearanceCertificates,
                propertyTaxDocument: _propertyTaxDocument,
                encumbranceCertificate: _encumbranceCertificate,
                propertyVerification: "pending",
                registrationRequest: "pending",
                marketStatus: "nonAvailable",
                transactionData: "NotCompleted",
                registrationDate: 0
            })
        );

        emit PropertyAdded(propertyId, msg.sender, _location, _price);
    }

    function verifyProperty(uint256 _propertyId, string memory _verificationStatus) public {
        require(_propertyId < properties.length, "Property does not exist");

        properties[_propertyId].propertyVerification = _verificationStatus;

        emit PropertyVerified(_propertyId, _verificationStatus);
    }

    function sellProperty(uint256 _propertyId) public {
        require(_propertyId < properties.length, "Property does not exist");
        require(properties[_propertyId].seller == msg.sender, "Only seller can list property");

        properties[_propertyId].marketStatus = "available";
    }

    function requestToBuy(uint256 _propertyId) public {
        require(_propertyId < properties.length, "Property does not exist");
        properties[_propertyId].registrationRequest = "pending";
        properties[_propertyId].marketStatus = "nonAvailable";
        properties[_propertyId].buyer = msg.sender;
        emit PropertyRequested(_propertyId, msg.sender);
    }

    function approveBuy(uint256 _propertyId, uint256 _registrationDate) public {
        require(_propertyId < properties.length, "Property does not exist");
        require(_registrationDate > 0, "Registration date must be valid");
        
        properties[_propertyId].registrationDate = _registrationDate;
        properties[_propertyId].transactionData = "completed";
        properties[_propertyId].registrationRequest = "approved";

        emit PropertyApproved(
            _propertyId, 
            properties[_propertyId].seller, 
            properties[_propertyId].buyer,
            _registrationDate
        );
    }

    function viewByIndex(uint256 _propertyId) public view returns (Property memory) {
        require(_propertyId < properties.length, "Property does not exist");
        return properties[_propertyId];
    }

    function viewAll() public view returns (Property[] memory) {
        return properties;
    }
}
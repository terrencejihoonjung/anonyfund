import { db } from "../firebase-admin.mjs";
import admin from "firebase-admin";

export const createCampaign = async (req, res) => {
  console.log("made it to the backend");
  const {
    title,
    description,
    goalAmount,
    category,
    imageUrl,
    ownerWalletAddress,
  } = req.body;

  const newCampaign = {
    title,
    description,
    goalAmount,
    category,
    imageUrl,
    ownerWalletAddress,
    raisedAmount: 0,
    createdAt: admin.database.ServerValue.TIMESTAMP,
  };

  const newCampaignRef = db.ref("campaigns").push();

  newCampaignRef.set(
    {
      title,
      description,
      goalAmount,
      category,
      imageUrl,
      ownerWalletAddress,
      raisedAmount: 0,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    },
    (error) => {
      if (error) {
        res.status(500).send("Error creating campaign");
      } else {
        const createdCampaign = {
          ...newCampaign,
          id: newCampaignRef.key,
        };
        res.status(201).json(createdCampaign);
      }
    }
  );
};

// Get All Campaigns
export const getCampaigns = async (req, res) => {
  const campaignsRef = db.ref("campaigns");
  campaignsRef.once(
    "value",
    (snapshot) => {
      res.json(snapshot.val());
    },
    (error) => {
      res.status(500).send("Error fetching campaigns");
    }
  );
};

// Get Campaign by ID
export const getCampaign = async (req, res) => {
  const campaignRef = db.ref(`campaigns/${req.params.id}`);
  campaignRef.once(
    "value",
    (snapshot) => {
      res.json(snapshot.val());
    },
    (error) => {
      res.status(500).send("Error fetching campaign");
    }
  );
};

// GET /api/campaigns/:id/donations
export const getDonations = async (req, res) => {
  const campaignId = req.params.id;

  const donationsRef = db
    .ref("donations")
    .orderByChild("campaignId")
    .equalTo(campaignId);
  const snapshot = await donationsRef.once("value");
  const donations = snapshot.val();

  res.json(donations);
};

// Update a Campaign
// Ensure to include authorization checks here
export const updateCampaign = async (req, res) => {
  const updates = req.body;
  const campaignRef = db.ref(`campaigns/${req.params.id}`);

  // Add validation and error handling here

  campaignRef.update(updates, (error) => {
    if (error) {
      res.status(500).send("Error updating campaign");
    } else {
      res.status(200).send("Campaign updated successfully");
    }
  });
};

// Delete a Campaign
// Ensure to include authorization checks here
export const deleteCampaign = async (req, res) => {
  const campaignRef = db.ref(`campaigns/${req.params.id}`);
  campaignRef.remove((error) => {
    if (error) {
      res.status(500).send("Error deleting campaign");
    } else {
      res.status(200).send("Campaign deleted successfully");
    }
  });
};

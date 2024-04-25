import mongoose from "mongoose";

const Schema = mongoose.Schema;

const timbratriceSchema = new Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    entrata: {
      type: Number,
      required: true,
    },
    uscita: {
      type: Number,
      required: true,
    },
    durata: {
      type: Number,
      required: true,
    },
    fascia: {
      type: String,
      required: true,
    },
    moltiplicatoreBonus: {
      type: Number,
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
  },
  { collection: "timbratrice", timestamps: true }
);

const tempTimbratriceSchema = new Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    fascia: {
      type: String,
      required: true,
    },
    moltiplicatoreBonus: {
      type: Number,
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
  },
  { collection: "timbratriceTemp", timestamps: true }
);

const totaliSettimanaliSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    totaleDurata: {
      type: Number,
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: true,
    },
  },
  { collection: "totaliSettimanali", timestamps: true }
);

export const Timbratrice = mongoose.model("Timbratrice", timbratriceSchema);
export const TimbratriceTemp = mongoose.model(
  "TimbratriceTemp",
  tempTimbratriceSchema
);
export const TotaliSettimanali = mongoose.model(
  "TotaliSettimanali",
  totaliSettimanaliSchema
);

package com.casestudy.twopointzero.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;


@Entity
@Table(name = "householdappliance")
public class HouseholdAppliance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "brand")
	private String brand;
	
	@Column(name = "model")
	private String model;
	
	@Column(name = "serial_Number")
	private String serialNumber;
	
	@CreationTimestamp
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "date_bought")
	private Date dateBought;
	
	@Column(name = "status")
	private String status;
	
	public HouseholdAppliance() {
		super();
	}

	public HouseholdAppliance(String brand, String model, String serialNumber, Date dateBought, String status) {
		super();
		this.brand = brand;
		this.model = model;
		this.serialNumber = serialNumber;
		this.dateBought = dateBought;
		this.status = status;
	}
	
	// For Unit Testing purposes
	public HouseholdAppliance(long id, String brand, String model, String serialNumber, Date dateBought,
			String status) {
		super();
		this.id = id;
		this.brand = brand;
		this.model = model;
		this.serialNumber = serialNumber;
		this.dateBought = dateBought;
		this.status = status;
	}
	
	public void setId(long id) {
		this.id = id;
	}

	public long getId() {
		return id;
	}

	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getModel() {
		return model;
	}
	public void setModel(String model) {
		this.model = model;
	}
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
	public Date getDateBought() {
		return dateBought;
	}
	public void setDateBought(Date dateBought) {
		this.dateBought = dateBought;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
}
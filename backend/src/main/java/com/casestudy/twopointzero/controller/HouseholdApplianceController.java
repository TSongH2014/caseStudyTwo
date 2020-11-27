package com.casestudy.twopointzero.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.casestudy.twopointzero.exception.HouseholdAppliancesNotFoundException;
import com.casestudy.twopointzero.model.HouseholdAppliance;
import com.casestudy.twopointzero.service.HouseholdApplianceService;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HouseholdApplianceController {
	
	private HouseholdApplianceService householdApplianceService;
	
	@Autowired
	public HouseholdApplianceController(HouseholdApplianceService householdApplianceService) {
		this.householdApplianceService = householdApplianceService;
	}
	
	// get (all) household appliances
	@GetMapping("householdappliances")
	public List<HouseholdAppliance> getAllHouseholdAppliances() {
		return householdApplianceService.findAll();
	}
	
	// create new household appliance
	@PostMapping("householdappliances")
	public HouseholdAppliance createHouseholdAppliance(@RequestBody HouseholdAppliance householdAppliance) {
		
		householdAppliance.setId(0);
		
		HouseholdAppliance createdHouseholdAppliance = householdApplianceService.save(new HouseholdAppliance(householdAppliance.getBrand(), 
				householdAppliance.getModel(), householdAppliance.getSerialNumber(),null ,"New"));
		return createdHouseholdAppliance;
		
	}
	
	// update existing household appliance
	@PutMapping("householdappliances/{id}")
	public ResponseEntity<HouseholdAppliance> updateHouseholdAppliance(@PathVariable(value = "id") Long id,
			@Valid @RequestBody HouseholdAppliance householdAppliance) throws HouseholdAppliancesNotFoundException {
		
		HouseholdAppliance householdAppliance2 = householdApplianceService.findById(id)
				.orElseThrow(() -> new HouseholdAppliancesNotFoundException("Household Appliance not found for this id: " + id));
		
		householdAppliance2.setBrand(householdAppliance.getBrand());
		householdAppliance2.setDateBought(householdAppliance.getDateBought());
		householdAppliance2.setModel(householdAppliance.getModel());
		householdAppliance2.setSerialNumber(householdAppliance.getSerialNumber());
		householdAppliance2.setStatus(householdAppliance.getStatus());
		
		return ResponseEntity.ok(householdApplianceService.save(householdAppliance2));
	}
	
	// remove existing household appliance
	@DeleteMapping("householdappliances/{id}")
	public Map<String, Boolean> removeHouseholdAppliance(@PathVariable(value = "id") Long id) throws HouseholdAppliancesNotFoundException {
		
		HouseholdAppliance householdAppliance2 = householdApplianceService.findById(id)
				.orElseThrow(() -> new HouseholdAppliancesNotFoundException("Household Appliance not found for this id: " + id));
		
		householdApplianceService.deleteById(id);
		
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
		
	}
	
}
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { AuthService } from '../shared/auth.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  couleur = 'orange';
  ajoutActive = false;

  assignments: Assignment[] = [];
  // slider pour changer la limite
  sliderLimit: number = 20;

  // Pour pagination
  page: number = 1;
  limit: number = 20;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu', 'supprimer', 'modifier', 'details', 'valider'];

  clickedRows = new Set<Assignment>();
  constructor(private assignmentsService: AssignmentsService, private snackBar: MatSnackBar,
    private router: Router, private auth: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('Appelé avant affichage');
    // appelée avant l'affichage du composant
    // on demande les donnnées au service de gestion des assignments
    this.getAssignments();
  }

  getAssignments() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit).subscribe((data) => {
      this.assignments = data.docs;
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;
      console.log("données reçues");
    });
  }

  changeLimit() {
    console.log("change limit")
    this.limit = this.sliderLimit;
    this.getAssignments();
  }

  pagePrecedente() {
    this.page = this.prevPage;
    this.getAssignments();
  }

  pageSuivante() {
    this.page = this.nextPage;
    this.getAssignments();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  openDialog(assignment: Assignment, mode: string): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '300px',
      data: assignment,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      assignment = result;
      if (mode == 'supprimer') {
        this.assignmentsService.deleteAssignment(assignment).subscribe((response) => {
          this.openSnackBar(assignment, 'supprimer');
          this.getAssignments();
          console.log(response.message);
        });
      }
      else if (mode == 'valider') {
        this.assignmentsService.updateAssignment(assignment)
          .subscribe((response) => {
            this.openSnackBar(assignment, 'valider');
            this.getAssignments();
            console.log(response.message);
          });
      }
    });
  }
  onDelete(assignment: Assignment) {
    this.assignmentsService.deleteAssignment(assignment).subscribe((response) => {
      this.getAssignments();
      console.log(response.message);
    });
  }

  onValidate(assignment: Assignment) {
    this.assignmentsService.updateAssignment(assignment)
      .subscribe((response) => {
        this.getAssignments();
        console.log(response.message);
      })
  }

  openSnackBar(assignment: Assignment, mode: string) {
    if (mode == 'supprimer') {
      this.snackBar.open('Le devoir ' + assignment.nom + ' a été supprimé', 'Ok!');
    }
    if (mode == 'valider') {
      this.snackBar.open('Le devoir ' + assignment.nom + ' a été marqué rendu', 'Ok');
    }
  }

  genererDonneesDeTest() {
    this.assignmentsService.peuplerBDAvecForkJoin()
      .subscribe(() => {
        // ok, les 1000 données ont bien été insérées...
        console.log("TOUTES LES DONNEES ONT BIEN ETE INSEREES");

        this.router.navigate(["/home"]);
      });
  }

  logout() {
    this.auth.logOut();
    this.router.navigate(["/login"]);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Assignment,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}